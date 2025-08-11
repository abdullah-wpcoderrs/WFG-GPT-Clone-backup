"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  Users,
  MessageSquare,
  Copy,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Search,
  MoreHorizontal,
  Trash2,
  Calendar,
  User,
} from "lucide-react"

import { useState, useEffect } from "react"
import { getMemory, removeMemoryItem, clearMemory, searchMemory } from "@/lib/chat-memory"
import { learnFromMemory, getLearningStats, getPatternSuggestions, ChatPattern } from "@/lib/chat-learner"
import { useAuth } from "@/hooks/use-auth"
import { canManageMemory } from "@/lib/rbac"
import { createApprovalRequest, canCreateApprovals } from "@/lib/approval-manager"
import type { MemoryItem } from "@/lib/chat-memory"
import { DocumentContextManager } from "./document-context-manager"

// Define navigation items for this dashboard section
const navigationItems = [
  { name: "Documents", href: "/dashboard/admin/documents", icon: FileText },
  { name: "Teams", href: "/dashboard/admin/teams", icon: Users },
  { name: "Chats", href: "/dashboard/admin/chats", icon: MessageSquare },
  { name: "GPTs", href: "/dashboard/admin/gpts", icon: Brain },
  { name: "Memory", href: "/dashboard/admin/memory", icon: BookOpen },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
]

export default function AdminMemoryPage() {
  const { user } = useAuth()
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([])
  const [patterns, setPatterns] = useState<ChatPattern[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTag, setFilterTag] = useState("all")
  const [learningStats, setLearningStats] = useState({
    totalInteractions: 0,
    learnedPatterns: 0,
    documentRequests: 0,
    errorResponses: 0
  })
  
  // Check if user has permission to manage memory
  const canManage = canManageMemory(user)
  
  // Check if user can create approval requests
  const canCreateApproval = canCreateApprovals(user)
  
  // Load memory items and patterns
  useEffect(() => {
    loadMemoryData()
  }, [])
  
  const loadMemoryData = () => {
    // Get all memory items
    const items = getMemory()
    setMemoryItems(items)
    
    // Get learned patterns
    const learnedPatterns = learnFromMemory()
    setPatterns(learnedPatterns)
    
    // Get learning stats
    const stats = getLearningStats()
    setLearningStats(stats)
  }
  
  const filteredMemoryItems = memoryItems.filter((item) => {
    const matchesSearch = 
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.response.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = filterTag === "all" || item.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }
  
  const handleDeleteMemoryItem = (id: string) => {
    if (!user) return
    
    // If user can manage directly, remove immediately
    if (canManage) {
      removeMemoryItem(id)
      loadMemoryData()
      return
    }
    
    // If user can create approvals, create an approval request
    if (canCreateApproval) {
      createApprovalRequest(
        "memory_delete",
        user.id,
        {
          memoryId: id,
          reason: "User requested memory item removal"
        }
      )
      // In a real app, we would show a notification to the user
      alert("Approval request created. Your request will be reviewed by an admin.")
      loadMemoryData()
      return
    }
    
    // User doesn't have permission to manage or create approvals
    alert("You don't have permission to remove memory items.")
  }
  
  const handleClearMemory = () => {
    if (!user) return
    
    // If user can manage directly, clear immediately
    if (canManage) {
      clearMemory()
      loadMemoryData()
      return
    }
    
    // If user can create approvals, create an approval request
    if (canCreateApproval) {
      createApprovalRequest(
        "memory_delete",
        user.id,
        {
          reason: "User requested clearing all memory"
        }
      )
      // In a real app, we would show a notification to the user
      alert("Approval request created. Your request will be reviewed by an admin.")
      loadMemoryData()
      return
    }
    
    // User doesn't have permission to manage or create approvals
    alert("You don't have permission to clear memory.")
  }
  
  const getTagBadge = (tag: string) => {
    switch (tag) {
      case "chat":
        return <Badge className="bg-blue-100 text-blue-800">Chat</Badge>
      case "document-request":
        return <Badge className="bg-green-100 text-green-800">Document</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge>{tag}</Badge>
    }
  }
  
  const tags = ["all", ...Array.from(new Set(memoryItems.flatMap(item => item.tags)))]
  
  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Memory Management"
      description="Manage your team's knowledge base and learned patterns."
    >
      {/* Memory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{learningStats.totalInteractions}</p>
                <p className="text-sm text-gray-600">Total Interactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{learningStats.learnedPatterns}</p>
                <p className="text-sm text-gray-600">Learned Patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{learningStats.documentRequests}</p>
                <p className="text-sm text-gray-600">Document Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{memoryItems.length}</p>
                <p className="text-sm text-gray-600">Memory Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patterns Section */}
      <Card className="border-[#E0E0E0] shadow-none mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#2C2C2C]">Learned Patterns</CardTitle>
          <CardDescription>
            Patterns the system has learned from chat interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pattern</TableHead>
                  <TableHead>Response Template</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patterns.length > 0 ? (
                  patterns.map((pattern) => (
                    <TableRow key={pattern.id}>
                      <TableCell className="font-medium">{pattern.pattern}</TableCell>
                      <TableCell>{pattern.responseTemplate}</TableCell>
                      <TableCell>{pattern.frequency}</TableCell>
                      <TableCell>{formatDate(pattern.lastUsed)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {pattern.tags.map((tag, index) => (
                            <span key={index}>{getTagBadge(tag)}</span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No patterns learned yet. Interact with the chat to generate patterns.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="border-[#E0E0E0] shadow-none mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search memory by prompt or response..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag === "all" ? "All Tags" : tag}
                  </option>
                ))}
              </select>
              <Button 
                variant="outline" 
                onClick={loadMemoryData}
                className="border-[#E0E0E0] text-[#2C2C2C] hover:bg-[#F5F5F5]"
              >
                Refresh
              </Button>
              {canManage && (
                <Button 
                  variant="outline" 
                  onClick={handleClearMemory}
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  Clear Memory
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Items Table */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#2C2C2C]">Memory Items</CardTitle>
          <CardDescription>
            All chat interactions stored in memory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMemoryItems.length > 0 ? (
                  filteredMemoryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium max-w-xs truncate">{item.prompt}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.response}</TableCell>
                      <TableCell>{item.sessionId.substring(0, 8)}...</TableCell>
                      <TableCell>{formatDate(item.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <span key={index}>{getTagBadge(tag)}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {canManage ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => navigator.clipboard.writeText(item.prompt)}
                                className="cursor-pointer"
                              >
                                Copy Prompt
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => navigator.clipboard.writeText(item.response)}
                                className="cursor-pointer"
                              >
                                Copy Response
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteMemoryItem(item.id)}
                                className="cursor-pointer text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 cursor-pointer"
                              onClick={() => navigator.clipboard.writeText(item.prompt)}
                            >
                              <span className="sr-only">Copy prompt</span>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 cursor-pointer"
                              onClick={() => navigator.clipboard.writeText(item.response)}
                            >
                              <span className="sr-only">Copy response</span>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No memory items found. Interact with the chat to generate memory items.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Document Contexts Section */}
      <DocumentContextManager />
    </DashboardLayout>
  )
}
