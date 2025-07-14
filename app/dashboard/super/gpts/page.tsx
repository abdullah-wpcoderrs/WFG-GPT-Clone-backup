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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Globe,
  TrendingUp,
  Clock,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Plus,
} from "lucide-react"
import Link from "next/link"

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

const mockAllGPTs = [
  {
    id: "gpt-1",
    name: "LegalGPT",
    description: "Specialized assistant for legal document review and compliance",
    team_name: "Strategic Support Team",
    team_id: "team-1",
    created_by: "Sarah Johnson",
    created_by_id: "admin-1",
    status: "active",
    approval_status: "approved",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
    usage_count: 456,
    active_users: 23,
    web_access: true,
    access_level: "team",
    model: "GPT-4",
    monthly_cost: 45.67,
    compliance_score: 95,
    risk_level: "low",
  },
  {
    id: "gpt-2",
    name: "FinanceBot",
    description: "Financial analysis and reporting assistant",
    team_name: "Finance Team",
    team_id: "team-2",
    created_by: "Michael Chen",
    created_by_id: "admin-2",
    status: "active",
    approval_status: "approved",
    created_at: "2024-01-08T14:20:00Z",
    updated_at: "2024-01-14T11:45:00Z",
    usage_count: 289,
    active_users: 15,
    web_access: false,
    access_level: "team",
    model: "GPT-4",
    monthly_cost: 28.93,
    compliance_score: 88,
    risk_level: "low",
  },
  {
    id: "gpt-3",
    name: "GlobalReportWriter",
    description: "Organization-wide report generation and analysis",
    team_name: "Organization-wide",
    team_id: "org",
    created_by: "Super Admin",
    created_by_id: "superadmin-1",
    status: "active",
    approval_status: "approved",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-15T16:20:00Z",
    usage_count: 1234,
    active_users: 67,
    web_access: true,
    access_level: "organization",
    model: "GPT-4",
    monthly_cost: 123.45,
    compliance_score: 92,
    risk_level: "medium",
  },
  {
    id: "gpt-4",
    name: "HR Assistant",
    description: "Human resources support and policy guidance",
    team_name: "Learning and Development",
    team_id: "team-3",
    created_by: "HR Team",
    created_by_id: "admin-3",
    status: "pending",
    approval_status: "pending",
    created_at: "2024-01-12T09:15:00Z",
    updated_at: "2024-01-12T16:20:00Z",
    usage_count: 45,
    active_users: 8,
    web_access: false,
    access_level: "team",
    model: "GPT-3.5",
    monthly_cost: 4.56,
    compliance_score: 78,
    risk_level: "medium",
  },
  {
    id: "gpt-5",
    name: "DataAnalyzer",
    description: "Advanced data analysis and visualization tool",
    team_name: "Revenue Growth Unit",
    team_id: "team-5",
    created_by: "Data Team",
    created_by_id: "admin-4",
    status: "suspended",
    approval_status: "rejected",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-10T12:30:00Z",
    usage_count: 156,
    active_users: 12,
    web_access: true,
    access_level: "team",
    model: "GPT-4",
    monthly_cost: 15.67,
    compliance_score: 65,
    risk_level: "high",
  },
]

export default function SuperGPTsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTeam, setFilterTeam] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterApproval, setFilterApproval] = useState("all")
  const [selectedGPTs, setSelectedGPTs] = useState<string[]>([])
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [selectedGPT, setSelectedGPT] = useState<any>(null)
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve")
  const [approvalNotes, setApprovalNotes] = useState("")

  const filteredGPTs = mockAllGPTs.filter((gpt) => {
    const matchesSearch =
      gpt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gpt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gpt.team_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTeam = filterTeam === "all" || gpt.team_id === filterTeam
    const matchesStatus = filterStatus === "all" || gpt.status === filterStatus
    const matchesApproval = filterApproval === "all" || gpt.approval_status === filterApproval
    return matchesSearch && matchesTeam && matchesStatus && matchesApproval
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getApprovalBadge = (approval: string) => {
    switch (approval) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge>{approval}</Badge>
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

  const handleSelectGPT = (gptId: string, checked: boolean) => {
    if (checked) {
      setSelectedGPTs([...selectedGPTs, gptId])
    } else {
      setSelectedGPTs(selectedGPTs.filter((id) => id !== gptId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGPTs(filteredGPTs.map((gpt) => gpt.id))
    } else {
      setSelectedGPTs([])
    }
  }

  const handleApprovalAction = (gpt: any, action: "approve" | "reject") => {
    setSelectedGPT(gpt)
    setApprovalAction(action)
    setIsApprovalDialogOpen(true)
  }

  const handleSubmitApproval = () => {
    console.log(`${approvalAction} GPT:`, selectedGPT?.id, "Notes:", approvalNotes)
    setIsApprovalDialogOpen(false)
    setApprovalNotes("")
    setSelectedGPT(null)
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for GPTs:`, selectedGPTs)
    setSelectedGPTs([])
  }

  const uniqueTeams = Array.from(new Set(mockAllGPTs.map((gpt) => ({ id: gpt.team_id, name: gpt.team_name }))))
  const totalCost = mockAllGPTs.reduce((sum, gpt) => sum + gpt.monthly_cost, 0)
  const pendingApprovals = mockAllGPTs.filter((gpt) => gpt.approval_status === "pending").length
  const highRiskGPTs = mockAllGPTs.filter((gpt) => gpt.risk_level === "high").length

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="All GPTs"
      description="Manage and monitor all AI assistants across the organization."
    >
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{mockAllGPTs.length}</p>
                <p className="text-sm text-gray-600">Total GPTs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{pendingApprovals}</p>
                <p className="text-sm text-gray-600">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{highRiskGPTs}</p>
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
                  placeholder="Search GPTs by name, description, or team..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={filterApproval}
                onChange={(e) => setFilterApproval(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Approvals</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedGPTs.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedGPTs.length} GPT{selectedGPTs.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("approve")}>
                    Bulk Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("suspend")}>
                    Bulk Suspend
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
                    Bulk Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GPTs Table */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle className="text-xl text-[#2C2C2C]">Organization GPTs</CardTitle>
          <Button
            asChild
            size="sm"
            className="btn-primary shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
          >
            <Link href="/dashboard/super/gpts/new">
              <Plus className="w-4 h-4 mr-2" />
              Create New GPT
            </Link>
          </Button>
        </CardHeader>
        <CardDescription>
          {filteredGPTs.length} GPT{filteredGPTs.length !== 1 ? "s" : ""} found
        </CardDescription>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedGPTs.length === filteredGPTs.length && filteredGPTs.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>GPT & Team</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage & Cost</TableHead>
                <TableHead>Risk & Compliance</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGPTs.map((gpt) => (
                <TableRow key={gpt.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedGPTs.includes(gpt.id)}
                      onCheckedChange={(checked) => handleSelectGPT(gpt.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#B9E769] rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-[#2C2C2C]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#2C2C2C]">{gpt.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{gpt.team_name}</span>
                          {gpt.access_level === "organization" && (
                            <Badge variant="outline" className="text-xs">
                              <Globe className="w-3 h-3 mr-1" />
                              Org-wide
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(gpt.status)}
                      {getApprovalBadge(gpt.approval_status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span>{gpt.active_users} users</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <TrendingUp className="w-3 h-3 text-gray-400" />
                        <span>{gpt.usage_count} uses</span>
                      </div>
                      <div className="text-sm font-medium text-green-600">${gpt.monthly_cost.toFixed(2)}/mo</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getRiskBadge(gpt.risk_level)}
                      <div className="text-sm text-gray-600">Compliance: {gpt.compliance_score}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <span>{formatDate(gpt.created_at)}</span>
                      </div>
                      <div className="text-xs text-gray-500">by {gpt.created_by}</div>
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
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/super/chats/${gpt.id}`}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Open Chat
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit GPT
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        {gpt.approval_status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprovalAction(gpt, "approve")}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleApprovalAction(gpt, "reject")}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredGPTs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No GPTs found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === "approve" ? "Approve" : "Reject"} GPT: {selectedGPT?.name}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === "approve"
                ? "Approve this GPT for use across the organization."
                : "Reject this GPT and provide feedback to the creator."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approval-notes">
                {approvalAction === "approve" ? "Approval Notes (Optional)" : "Rejection Reason"}
              </Label>
              <Textarea
                id="approval-notes"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder={
                  approvalAction === "approve"
                    ? "Add any notes about the approval..."
                    : "Explain why this GPT is being rejected..."
                }
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitApproval}
              className={approvalAction === "approve" ? "btn-primary" : "bg-red-600 hover:bg-red-700 text-white"}
            >
              {approvalAction === "approve" ? "Approve GPT" : "Reject GPT"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
