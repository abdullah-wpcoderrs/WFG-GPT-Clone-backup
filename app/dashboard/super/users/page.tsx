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
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Brain,
  Users,
  Building2,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  Search,
  MoreHorizontal,
  Calendar,
  Activity,
  Edit,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Crown,
} from "lucide-react"

const navigationItems = [
  {
    name: "Overview",
    href: "/dashboard/super",
    icon: BarChart3,
    description: "System-wide metrics",
  },
  {
    name: "All GPTs",
    href: "/dashboard/super/gpts",
    icon: Brain,
    description: "Organization GPT management",
  },
  {
    name: "User Management",
    href: "/dashboard/super/users",
    icon: Users,
    description: "All users & permissions",
  },
  {
    name: "Teams & Units",
    href: "/dashboard/super/teams",
    icon: Building2,
    description: "Team structure & assignments",
  },
  {
    name: "Document Library",
    href: "/dashboard/super/documents",
    icon: FileText,
    description: "Global document management",
  },
  {
    name: "Prompt Library",
    href: "/dashboard/super/prompts",
    icon: BookOpen,
    description: "Organization prompt templates",
  },
  {
    name: "System Settings",
    href: "/dashboard/super/settings",
    icon: Settings,
    description: "Platform configuration",
  },
  {
    name: "Security",
    href: "/dashboard/super/security",
    icon: Shield,
    description: "Access control & policies",
  },
]

const mockAllUsers = [
  {
    id: "user-1",
    full_name: "John Smith",
    email: "john.smith@company.com",
    role: "user",
    team_name: "Strategic Support Team",
    team_id: "team-1",
    status: "active",
    last_active: "2024-01-15T16:30:00Z",
    joined_date: "2024-01-01T09:00:00Z",
    chat_count: 145,
    gpt_usage: 456,
    monthly_cost: 23.45,
    productivity_score: 85,
    compliance_score: 92,
    risk_level: "low",
    permissions: ["chat", "documents", "prompts"],
  },
  {
    id: "admin-1",
    full_name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "admin",
    team_name: "Finance Team",
    team_id: "team-2",
    status: "active",
    last_active: "2024-01-15T17:45:00Z",
    joined_date: "2023-12-01T08:00:00Z",
    chat_count: 89,
    gpt_usage: 234,
    monthly_cost: 45.67,
    productivity_score: 94,
    compliance_score: 96,
    risk_level: "low",
    permissions: ["chat", "documents", "prompts", "team_management", "gpt_creation"],
  },
  {
    id: "superadmin-1",
    full_name: "Michael Chen",
    email: "michael.chen@company.com",
    role: "super_admin",
    team_name: "Executive Management",
    team_id: "team-7",
    status: "active",
    last_active: "2024-01-15T18:20:00Z",
    joined_date: "2023-11-15T10:30:00Z",
    chat_count: 67,
    gpt_usage: 189,
    monthly_cost: 78.9,
    productivity_score: 88,
    compliance_score: 98,
    risk_level: "low",
    permissions: ["all"],
  },
  {
    id: "user-2",
    full_name: "Emily Johnson",
    email: "emily.johnson@company.com",
    role: "user",
    team_name: "Learning and Development",
    team_id: "team-3",
    status: "suspended",
    last_active: "2024-01-10T14:20:00Z",
    joined_date: "2023-12-15T10:30:00Z",
    chat_count: 234,
    gpt_usage: 567,
    monthly_cost: 34.56,
    productivity_score: 76,
    compliance_score: 68,
    risk_level: "high",
    permissions: ["chat", "documents"],
  },
  {
    id: "user-3",
    full_name: "David Wilson",
    email: "david.wilson@company.com",
    role: "user",
    team_name: "Revenue Growth Unit",
    team_id: "team-5",
    status: "pending",
    last_active: "2024-01-12T11:45:00Z",
    joined_date: "2024-01-12T11:45:00Z",
    chat_count: 12,
    gpt_usage: 28,
    monthly_cost: 2.34,
    productivity_score: 65,
    compliance_score: 85,
    risk_level: "medium",
    permissions: ["chat"],
  },
]

export default function SuperUsersPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTeam, setFilterTeam] = useState("all")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [actionType, setActionType] = useState<"suspend" | "activate" | "delete" | "promote">("suspend")

  const filteredUsers = mockAllUsers.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.team_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTeam = filterTeam === "all" || user.team_id === filterTeam
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesTeam && matchesRole && matchesStatus
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
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-800">
            <Ban className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <Crown className="w-3 h-3 mr-1" />
            Super Admin
          </Badge>
        )
      case "admin":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )
      case "user":
        return <Badge className="bg-gray-100 text-gray-800">User</Badge>
      default:
        return <Badge>{role}</Badge>
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
      default:
        return <Badge>{risk}</Badge>
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleUserAction = (user: any, action: "suspend" | "activate" | "delete" | "promote") => {
    setSelectedUser(user)
    setActionType(action)
    setIsActionDialogOpen(true)
  }

  const handleSubmitAction = () => {
    console.log(`${actionType} user:`, selectedUser?.id)
    setIsActionDialogOpen(false)
    setSelectedUser(null)
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for users:`, selectedUsers)
    setSelectedUsers([])
  }

  const uniqueTeams = Array.from(new Set(mockAllUsers.map((user) => ({ id: user.team_id, name: user.team_name }))))
  const totalUsers = mockAllUsers.length
  const activeUsers = mockAllUsers.filter((u) => u.status === "active").length
  const pendingUsers = mockAllUsers.filter((u) => u.status === "pending").length
  const highRiskUsers = mockAllUsers.filter((u) => u.risk_level === "high").length
  const totalCost = mockAllUsers.reduce((sum, user) => sum + user.monthly_cost, 0)

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="User Management"
      description="Manage all users across the organization with comprehensive controls."
    >
      <div className="space-y-6">
      {/* User Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{activeUsers}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{pendingUsers}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ban className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{highRiskUsers}</p>
                <p className="text-sm text-gray-600">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">${totalCost.toFixed(0)}</p>
                <p className="text-sm text-gray-600">Monthly Cost</p>
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
                  placeholder="Search users by name, email, or team..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Teams</option>
                {uniqueTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate")}>
                    Bulk Activate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("suspend")}>
                    Bulk Suspend
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
                    Export Data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">All Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>User & Team</TableHead>
                <TableHead>Role & Status</TableHead>
                <TableHead>Activity & Usage</TableHead>
                <TableHead>Risk & Compliance</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C] font-medium">
                          {user.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[#2C2C2C]">{user.full_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.team_name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Activity className="w-3 h-3 text-gray-400" />
                        <span>{user.chat_count} chats</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Brain className="w-3 h-3 text-gray-400" />
                        <span>{user.gpt_usage} GPT uses</span>
                      </div>
                      <div className="text-sm font-medium text-green-600">${user.monthly_cost.toFixed(2)}/mo</div>
                      <div className="text-xs text-gray-500">Last active {formatLastActive(user.last_active)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getRiskBadge(user.risk_level)}
                      <div className="text-sm text-gray-600">Productivity: {user.productivity_score}%</div>
                      <div className="text-sm text-gray-600">Compliance: {user.compliance_score}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(user.joined_date)}</span>
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
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          Manage Permissions
                        </DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem onClick={() => handleUserAction(user, "suspend")}>
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleUserAction(user, "activate")}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                        {user.role === "user" && (
                          <DropdownMenuItem onClick={() => handleUserAction(user, "promote")}>
                            <Crown className="w-4 h-4 mr-2" />
                            Promote to Admin
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600" onClick={() => handleUserAction(user, "delete")}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "suspend" && "Suspend User"}
              {actionType === "activate" && "Activate User"}
              {actionType === "delete" && "Delete User"}
              {actionType === "promote" && "Promote User"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "suspend" && `Suspend ${selectedUser?.full_name}? They will lose access immediately.`}
              {actionType === "activate" && `Activate ${selectedUser?.full_name}? They will regain full access.`}
              {actionType === "delete" &&
                `Permanently delete ${selectedUser?.full_name}? This action cannot be undone.`}
              {actionType === "promote" &&
                `Promote ${selectedUser?.full_name} to Admin? They will gain team management permissions.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              className={
                actionType === "delete"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : actionType === "suspend"
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "btn-primary"
              }
            >
              {actionType === "suspend" && "Suspend User"}
              {actionType === "activate" && "Activate User"}
              {actionType === "delete" && "Delete User"}
              {actionType === "promote" && "Promote User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  )
}
