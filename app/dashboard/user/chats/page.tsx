"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Brain,
  MessageSquare,
  FolderOpen,
  BookOpen,
  FileText,
  Settings,
  Search,
  MoreHorizontal,
  Calendar,
  Clock,
} from "lucide-react"

const navigationItems = [
  {
    name: "My GPT Tools",
    href: "/dashboard/user",
    icon: Brain,
    description: "Access your assigned GPTs",
  },
  {
    name: "My Chats",
    href: "/dashboard/user/chats",
    icon: MessageSquare,
    description: "Chat history & sessions",
  },
  {
    name: "My Projects",
    href: "/dashboard/user/projects",
    icon: FolderOpen,
    description: "Organized chat folders",
  },
  {
    name: "Prompt Library",
    href: "/dashboard/user/prompts",
    icon: BookOpen,
    description: "Saved prompt templates",
  },
  {
    name: "Team Documents",
    href: "/dashboard/user/documents",
    icon: FileText,
    description: "Shared team resources",
  },
  {
    name: "Settings",
    href: "/dashboard/user/settings",
    icon: Settings,
    description: "Profile & preferences",
  },
]

const mockChats = [
  {
    id: "chat-1",
    title: "Draft NDA for vendor partnership",
    gpt_name: "LegalGPT",
    created_at: "2024-01-15T14:30:00Z",
    updated_at: "2024-01-15T15:45:00Z",
    message_count: 12,
    status: "completed",
  },
  {
    id: "chat-2",
    title: "Q2 Strategic analysis report",
    gpt_name: "ReportWriter",
    created_at: "2024-01-14T11:15:00Z",
    updated_at: "2024-01-14T16:20:00Z",
    message_count: 8,
    status: "active",
  },
  {
    id: "chat-3",
    title: "Review contract terms and conditions",
    gpt_name: "LegalGPT",
    created_at: "2024-01-13T16:45:00Z",
    updated_at: "2024-01-13T17:30:00Z",
    message_count: 15,
    status: "completed",
  },
  {
    id: "chat-4",
    title: "Employee onboarding checklist",
    gpt_name: "ReportWriter",
    created_at: "2024-01-12T09:20:00Z",
    updated_at: "2024-01-12T10:45:00Z",
    message_count: 6,
    status: "archived",
  },
  {
    id: "chat-5",
    title: "Policy compliance review",
    gpt_name: "LegalGPT",
    created_at: "2024-01-11T13:10:00Z",
    updated_at: "2024-01-11T14:25:00Z",
    message_count: 9,
    status: "completed",
  },
]

export default function ChatsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredChats = mockChats.filter((chat) => {
    const matchesSearch =
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.gpt_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || chat.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="My Chats"
      description="View and manage your conversation history with AI assistants."
    >
      {/* Search and Filters */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search chats by title or GPT name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                className={filterStatus === "all" ? "btn-primary" : ""}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                onClick={() => setFilterStatus("active")}
                className={filterStatus === "active" ? "btn-primary" : ""}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "completed" ? "default" : "outline"}
                onClick={() => setFilterStatus("completed")}
                className={filterStatus === "completed" ? "btn-primary" : ""}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat History Table */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">Chat History</CardTitle>
          <CardDescription>
            {filteredChats.length} chat{filteredChats.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chat Title</TableHead>
                <TableHead>GPT Used</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChats.map((chat) => (
                <TableRow key={chat.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#B9E769] rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-[#2C2C2C]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#2C2C2C]">{chat.title}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-[#66BB6A]" />
                      <span className="text-sm">{chat.gpt_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{chat.message_count} messages</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(chat.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(chat.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(chat.updated_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Continue Chat</DropdownMenuItem>
                        <DropdownMenuItem>Save to Project</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredChats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No chats found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
