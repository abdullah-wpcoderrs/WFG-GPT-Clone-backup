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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
  UserPlus,
  Mail,
  Calendar,
  Activity,
  Shield,
  Edit,
  Trash2,
} from "lucide-react"

// Define navigation items for this dashboard section
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
    name: "My Chats",
    href: "/dashboard/admin/chats",
    icon: MessageSquare,
    description: "My personal chat history",
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

const mockTeamMembers = [
  {
    id: "user-1",
    full_name: "John Smith",
    email: "john.smith@company.com",
    role: "user",
    status: "active",
    last_active: "2024-01-15T16:30:00Z",
    joined_date: "2024-01-01T09:00:00Z",
    chat_count: 45,
    gpt_usage: 156,
    favorite_gpt: "LegalGPT",
    productivity_score: 85,
  },
  {
    id: "user-2",
    full_name: "Emily Johnson",
    email: "emily.johnson@company.com",
    role: "user",
    status: "active",
    last_active: "2024-01-15T14:20:00Z",
    joined_date: "2023-12-15T10:30:00Z",
    chat_count: 67,
    gpt_usage: 234,
    favorite_gpt: "FinanceBot",
    productivity_score: 92,
  },
  {
    id: "user-3",
    full_name: "Michael Brown",
    email: "michael.brown@company.com",
    role: "user",
    status: "inactive",
    last_active: "2024-01-10T11:45:00Z",
    joined_date: "2024-01-05T14:15:00Z",
    chat_count: 12,
    gpt_usage: 28,
    favorite_gpt: "LegalGPT",
    productivity_score: 65,
  },
  {
    id: "user-4",
    full_name: "Sarah Davis",
    email: "sarah.davis@company.com",
    role: "user",
    status: "active",
    last_active: "2024-01-15T17:10:00Z",
    joined_date: "2023-11-20T08:45:00Z",
    chat_count: 89,
    gpt_usage: 312,
    favorite_gpt: "HR Assistant",
    productivity_score: 88,
  },
]

export default function AdminMembersPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("user")

  const filteredMembers = mockTeamMembers.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || member.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatLastActive = (dateString: string) => {
    const now = new Date()
    const lastActive = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getProductivityColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const handleInviteMember = () => {
    console.log("Inviting member:", { email: inviteEmail, role: inviteRole })
    setIsInviteDialogOpen(false)
    setInviteEmail("")
    setInviteRole("user")
  }

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Team Members"
      description="Manage your team members, track activity, and control access."
    >
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{mockTeamMembers.length}</p>
                <p className="text-sm text-gray-600">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">
                  {mockTeamMembers.filter((m) => m.status === "active").length}
                </p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">
                  {mockTeamMembers.reduce((sum, member) => sum + member.chat_count, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">
                  {Math.round(
                    mockTeamMembers.reduce((sum, member) => sum + member.productivity_score, 0) /
                      mockTeamMembers.length,
                  )}
                  %
                </p>
                <p className="text-sm text-gray-600">Avg Productivity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Invite */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search members by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-primary">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>Send an invitation to join your team.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invite-role">Role</Label>
                      <select
                        id="invite-role"
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInviteMember} className="btn-primary">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="border-[#E0E0E0] shadow-none mt-6">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">Team Members</CardTitle>
          <CardDescription>
            {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Productivity</TableHead>
                <TableHead>Favorite GPT</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C] font-medium">
                          {member.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[#2C2C2C]">{member.full_name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <MessageSquare className="w-3 h-3 text-gray-400" />
                        <span>{member.chat_count} chats</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Activity className="w-3 h-3" />
                        <span>Last active {formatLastActive(member.last_active)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#66BB6A] h-2 rounded-full"
                          style={{ width: `${member.productivity_score}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getProductivityColor(member.productivity_score)}`}>
                        {member.productivity_score}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Brain className="w-3 h-3 text-[#66BB6A]" />
                      <span className="text-sm">{member.favorite_gpt}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(member.joined_date)}</span>
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
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          View Chats
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No team members found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
