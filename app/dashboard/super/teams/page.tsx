"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  Users,
  Building2,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  TrendingUp,
  MessageSquare,
  Calendar,
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

const mockTeams = [
  {
    id: "team-1",
    name: "Strategic Support Team",
    description: "Legal compliance and strategic planning support",
    admin_name: "Sarah Johnson",
    admin_email: "sarah.johnson@company.com",
    admin_id: "admin-1",
    member_count: 12,
    active_members: 10,
    gpt_count: 3,
    monthly_usage: 1456,
    monthly_cost: 145.67,
    created_at: "2023-11-01T09:00:00Z",
    last_activity: "2024-01-15T16:30:00Z",
    productivity_score: 88,
    compliance_score: 95,
    status: "active",
    budget_limit: 500,
    usage_limit: 5000,
  },
  {
    id: "team-2",
    name: "Finance Team",
    description: "Financial analysis, reporting, and budget management",
    admin_name: "Michael Chen",
    admin_email: "michael.chen@company.com",
    admin_id: "admin-2",
    member_count: 8,
    active_members: 7,
    gpt_count: 2,
    monthly_usage: 892,
    monthly_cost: 89.23,
    created_at: "2023-10-15T10:30:00Z",
    last_activity: "2024-01-15T17:45:00Z",
    productivity_score: 92,
    compliance_score: 98,
    status: "active",
    budget_limit: 300,
    usage_limit: 3000,
  },
  {
    id: "team-3",
    name: "Learning and Development",
    description: "Employee training, development programs, and knowledge management",
    admin_name: "Emily Rodriguez",
    admin_email: "emily.rodriguez@company.com",
    admin_id: "admin-3",
    member_count: 15,
    active_members: 12,
    gpt_count: 4,
    monthly_usage: 2134,
    monthly_cost: 213.45,
    created_at: "2023-09-20T14:15:00Z",
    last_activity: "2024-01-15T14:20:00Z",
    productivity_score: 85,
    compliance_score: 91,
    status: "active",
    budget_limit: 600,
    usage_limit: 6000,
  },
  {
    id: "team-4",
    name: "Resourcing and Outsourcing Units",
    description: "Resource allocation and external vendor management",
    admin_name: "David Wilson",
    admin_email: "david.wilson@company.com",
    admin_id: "admin-4",
    member_count: 6,
    active_members: 5,
    gpt_count: 1,
    monthly_usage: 456,
    monthly_cost: 45.67,
    created_at: "2023-12-01T11:00:00Z",
    last_activity: "2024-01-14T12:30:00Z",
    productivity_score: 78,
    compliance_score: 87,
    status: "active",
    budget_limit: 200,
    usage_limit: 2000,
  },
  {
    id: "team-5",
    name: "Revenue Growth Unit",
    description: "Sales strategy, market analysis, and revenue optimization",
    admin_name: "Lisa Thompson",
    admin_email: "lisa.thompson@company.com",
    admin_id: "admin-5",
    member_count: 10,
    active_members: 8,
    gpt_count: 2,
    monthly_usage: 1789,
    monthly_cost: 178.9,
    created_at: "2023-11-10T08:45:00Z",
    last_activity: "2024-01-15T15:10:00Z",
    productivity_score: 91,
    compliance_score: 89,
    status: "active",
    budget_limit: 400,
    usage_limit: 4000,
  },
  {
    id: "team-6",
    name: "Business Development Unit",
    description: "Partnership development and business expansion initiatives",
    admin_name: "Robert Kim",
    admin_email: "robert.kim@company.com",
    admin_id: "admin-6",
    member_count: 7,
    active_members: 6,
    gpt_count: 1,
    monthly_usage: 623,
    monthly_cost: 62.34,
    created_at: "2023-10-05T13:20:00Z",
    last_activity: "2024-01-14T16:45:00Z",
    productivity_score: 83,
    compliance_score: 92,
    status: "active",
    budget_limit: 250,
    usage_limit: 2500,
  },
  {
    id: "team-7",
    name: "Executive Management",
    description: "C-level executives and senior leadership team",
    admin_name: "Michael Chen",
    admin_email: "michael.chen@company.com",
    admin_id: "superadmin-1",
    member_count: 5,
    active_members: 5,
    gpt_count: 3,
    monthly_usage: 567,
    monthly_cost: 156.78,
    created_at: "2023-09-01T09:00:00Z",
    last_activity: "2024-01-15T18:20:00Z",
    productivity_score: 94,
    compliance_score: 99,
    status: "active",
    budget_limit: 1000,
    usage_limit: 10000,
  },
]

export default function SuperTeamsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Form states
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [budgetLimit, setBudgetLimit] = useState("")
  const [usageLimit, setUsageLimit] = useState("")

  const filteredTeams = mockTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.admin_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatLastActivity = (dateString: string) => {
    const now = new Date()
    const lastActivity = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60))

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
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getBudgetUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const handleCreateTeam = () => {
    console.log("Creating team:", {
      name: teamName,
      description: teamDescription,
      budgetLimit,
      usageLimit,
    })
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditTeam = (team: any) => {
    setSelectedTeam(team)
    setTeamName(team.name)
    setTeamDescription(team.description)
    setBudgetLimit(team.budget_limit.toString())
    setUsageLimit(team.usage_limit.toString())
    setIsEditDialogOpen(true)
  }

  const handleUpdateTeam = () => {
    console.log("Updating team:", selectedTeam?.id, {
      name: teamName,
      description: teamDescription,
      budgetLimit,
      usageLimit,
    })
    setIsEditDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setTeamName("")
    setTeamDescription("")
    setBudgetLimit("")
    setUsageLimit("")
    setSelectedTeam(null)
  }

  const TeamFormDialog = ({ isOpen, onOpenChange, onSubmit, title, submitText }: any) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configure team settings, limits, and administrative details.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., Strategic Support Team"
              className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-description">Description</Label>
            <Textarea
              id="team-description"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              placeholder="Describe the team's role and responsibilities..."
              className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget-limit">Monthly Budget Limit ($)</Label>
              <Input
                id="budget-limit"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder="500"
                type="number"
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usage-limit">Monthly Usage Limit (tokens)</Label>
              <Input
                id="usage-limit"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="5000"
                type="number"
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} className="btn-primary">
            {submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const totalMembers = mockTeams.reduce((sum, team) => sum + team.member_count, 0)
  const totalActiveMembers = mockTeams.reduce((sum, team) => sum + team.active_members, 0)
  const totalGPTs = mockTeams.reduce((sum, team) => sum + team.gpt_count, 0)
  const totalCost = mockTeams.reduce((sum, team) => sum + team.monthly_cost, 0)
  const avgProductivity = Math.round(
    mockTeams.reduce((sum, team) => sum + team.productivity_score, 0) / mockTeams.length,
  )

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Teams & Units"
      description="Manage organizational structure, team assignments, and resource allocation."
    >
      {/* Organization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{mockTeams.length}</p>
                <p className="text-sm text-gray-600">Total Teams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{totalMembers}</p>
                <p className="text-sm text-gray-600">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{totalGPTs}</p>
                <p className="text-sm text-gray-600">Total GPTs</p>
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

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{avgProductivity}%</p>
                <p className="text-sm text-gray-600">Avg Productivity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Create */}
      <Card className="border-[#E0E0E0] shadow-none mt-6 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search teams by name, description, or admin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="border-[#E0E0E0] shadow-none card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#B9E769] rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#2C2C2C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#2C2C2C]">{team.name}</h3>
                    {getStatusBadge(team.status)}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditTeam(team)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Team
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Manage Members
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Team Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{team.description}</p>

              {/* Team Admin */}
              <div className="flex items-center space-x-2 mb-4">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-[#66BB6A] text-white text-xs">
                    {team.admin_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-[#2C2C2C]">{team.admin_name}</p>
                  <p className="text-xs text-gray-500">Team Admin</p>
                </div>
                <Crown className="w-4 h-4 text-yellow-500 ml-auto" />
              </div>

              {/* Team Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Members:</span>
                  </div>
                  <span className="font-medium">
                    {team.active_members}/{team.member_count}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Brain className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">GPTs:</span>
                  </div>
                  <span className="font-medium">{team.gpt_count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Monthly Usage:</span>
                  </div>
                  <span className="font-medium">{team.monthly_usage.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Monthly Cost:</span>
                  </div>
                  <span className={`font-medium ${getBudgetUsageColor(team.monthly_cost, team.budget_limit)}`}>
                    ${team.monthly_cost.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Budget Usage</span>
                  <span className="text-gray-500">
                    ${team.monthly_cost.toFixed(0)} / ${team.budget_limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (team.monthly_cost / team.budget_limit) * 100 >= 90
                        ? "bg-red-500"
                        : (team.monthly_cost / team.budget_limit) * 100 >= 75
                          ? "bg-yellow-500"
                          : "bg-[#66BB6A]"
                    }`}
                    style={{ width: `${Math.min((team.monthly_cost / team.budget_limit) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getProductivityColor(team.productivity_score)}`}>
                    {team.productivity_score}%
                  </div>
                  <div className="text-xs text-gray-500">Productivity</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getProductivityColor(team.compliance_score)}`}>
                    {team.compliance_score}%
                  </div>
                  <div className="text-xs text-gray-500">Compliance</div>
                </div>
              </div>

              {/* Last Activity */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Created {formatDate(team.created_at)}</span>
                </div>
                <span>Active {formatLastActivity(team.last_activity)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "No teams match your search criteria." : "Create your first team to get started."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Team
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Team Dialog */}
      <TeamFormDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTeam}
        title="Create New Team"
        submitText="Create Team"
      />

      {/* Edit Team Dialog */}
      <TeamFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateTeam}
        title="Edit Team"
        submitText="Update Team"
      />
    </DashboardLayout>
  )
}
