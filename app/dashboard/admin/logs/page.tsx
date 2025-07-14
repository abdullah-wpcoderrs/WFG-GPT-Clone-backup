"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Brain,
  Users,
  MessageSquare,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Search,
  MoreHorizontal,
  Calendar,
  Clock,
  Eye,
  Download,
} from "lucide-react"

const navigationItems = [
  {
    name: "Team Dashboard",
    href: "/dashboard/admin",
    icon: BarChart3,
    description: "Team overview & metrics",
  },
  {
    name: "Team GPTs",
    href: "/dashboard/admin/gpts",
    icon: Brain,
    description: "Manage team AI assistants",
  },
  {
    name: "Team Members",
    href: "/dashboard/admin/members",
    icon: Users,
    description: "User management & activity",
  },
  {
    name: "Chat Logs",
    href: "/dashboard/admin/logs",
    icon: MessageSquare,
    description: "Team conversation history",
  },
  {
    name: "Documents",
    href: "/dashboard/admin/documents",
    icon: FileText,
    description: "Team document library",
  },
  {
    name: "Prompt Templates",
    href: "/dashboard/admin/templates",
    icon: BookOpen,
    description: "Team prompt library",
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    description: "Team configuration",
  },
]

const mockChatLogs = [
  {
    id: "log-1",
    user_name: "John Smith",
    user_email: "john.smith@company.com",
    gpt_name: "LegalGPT",
    chat_title: "Contract review for vendor agreement",
    message_count: 15,
    duration: "45 minutes",
    created_at: "2024-01-15T14:30:00Z",
    status: "completed",
    tokens_used: 2450,
    cost: 0.12,
  },
  {
    id: "log-2",
    user_name: "Emily Johnson",
    user_email: "emily.johnson@company.com",
    gpt_name: "FinanceBot",
    chat_title: "Q4 budget analysis and projections",
    message_count: 22,
    duration: "1 hour 12 minutes",
    created_at: "2024-01-15T11:20:00Z",
    status: "completed",
    tokens_used: 3890,
    cost: 0.19,
  },
  {
    id: "log-3",
    user_name: "Michael Brown",
    user_email: "michael.brown@company.com",
    gpt_name: "LegalGPT",
    chat_title: "Policy compliance review",
    message_count: 8,
    duration: "22 minutes",
    created_at: "2024-01-15T09:45:00Z",
    status: "active",
    tokens_used: 1230,
    cost: 0.06,
  },
  {
    id: "log-4",
    user_name: "Sarah Davis",
    user_email: "sarah.davis@company.com",
    gpt_name: "HR Assistant",
    chat_title: "Employee handbook updates",
    message_count: 12,
    duration: "35 minutes",
    created_at: "2024-01-14T16:15:00Z",
    status: "completed",
    tokens_used: 1890,
    cost: 0.09,
  },
  {
    id: "log-5",
    user_name: "John Smith",
    user_email: "john.smith@company.com",
    gpt_name: "FinanceBot",
    chat_title: "Expense report analysis",
    message_count: 6,
    duration: "18 minutes",
    created_at: "2024-01-14T13:30:00Z",
    status: "completed",
    tokens_used: 890,
    cost: 0.04,
  },
]

export default function AdminLogsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGPT, setFilterGPT] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dateRange, setDateRange] = useState("7d")

  const filteredLogs = mockChatLogs.filter((log) => {
    const matchesSearch =
      log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.chat_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.gpt_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGPT = filterGPT === "all" || log.gpt_name === filterGPT
    const matchesStatus = filterStatus === "all" || log.status === filterStatus
    return matchesSearch && matchesGPT && matchesStatus
  })

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const uniqueGPTs = Array.from(new Set(mockChatLogs.map((log) => log.gpt_name)))
  const totalTokens = mockChatLogs.reduce((sum, log) => sum + log.tokens_used, 0)
  const totalCost = mockChatLogs.reduce((sum, log) => sum + log.cost, 0)

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Chat Logs"
      description="Monitor team conversations and analyze usage patterns."
    >
      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{mockChatLogs.length}</p>
                <p className="text-sm text-gray-600">Total Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">
                  {mockChatLogs.filter((log) => log.status === "active").length}
                </p>
                <p className="text-sm text-gray-600">Active Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{totalTokens.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Tokens Used</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">${totalCost.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by user, chat title, or GPT name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterGPT}
                onChange={(e) => setFilterGPT(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All GPTs</option>
                {uniqueGPTs.map((gpt) => (
                  <option key={gpt} value={gpt}>
                    {gpt}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
                <option value="error">Error</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Logs Table */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">Recent Chat Activity</CardTitle>
          <CardDescription>
            {filteredLogs.length} chat session{filteredLogs.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User & Chat</TableHead>
                <TableHead>GPT Used</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C] text-sm font-medium">
                          {log.user_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[#2C2C2C]">{log.chat_title}</p>
                        <p className="text-sm text-gray-500">{log.user_name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-[#66BB6A]" />
                      <span className="text-sm font-medium">{log.gpt_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <MessageSquare className="w-3 h-3 text-gray-400" />
                        <span>{log.message_count} messages</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{log.duration}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{log.tokens_used.toLocaleString()} tokens</div>
                      <div className="text-xs text-gray-500">${log.cost.toFixed(3)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateTime(log.created_at)}</span>
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
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No chat logs found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
