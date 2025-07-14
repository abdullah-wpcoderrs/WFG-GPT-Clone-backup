"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Brain,
  Users,
  MessageSquare,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  Globe,
  Lock,
  TrendingUp,
  Clock,
  Edit,
  Trash2,
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

const mockTeamGPTs = [
  {
    id: "gpt-1",
    name: "LegalGPT",
    description: "Specialized assistant for legal document review and compliance",
    status: "active",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
    usage_count: 156,
    active_users: 8,
    web_access: true,
    team_only: true,
    model: "GPT-4",
    instructions: "You are a legal assistant specialized in contract review and compliance...",
    knowledge_files: ["legal-guidelines.pdf", "compliance-checklist.docx"],
  },
  {
    id: "gpt-2",
    name: "FinanceBot",
    description: "Financial analysis and reporting assistant",
    status: "active",
    created_at: "2024-01-08T14:20:00Z",
    updated_at: "2024-01-14T11:45:00Z",
    usage_count: 89,
    active_users: 5,
    web_access: false,
    team_only: true,
    model: "GPT-4",
    instructions: "You are a financial analyst assistant that helps with reporting and analysis...",
    knowledge_files: ["financial-templates.xlsx", "budget-guidelines.pdf"],
  },
  {
    id: "gpt-3",
    name: "HR Assistant",
    description: "Human resources support and policy guidance",
    status: "draft",
    created_at: "2024-01-12T09:15:00Z",
    updated_at: "2024-01-12T16:20:00Z",
    usage_count: 12,
    active_users: 2,
    web_access: false,
    team_only: true,
    model: "GPT-3.5",
    instructions: "You are an HR assistant that helps with policy questions and procedures...",
    knowledge_files: ["employee-handbook.pdf"],
  },
]

export default function AdminGPTsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedGPT, setSelectedGPT] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Form states
  const [gptName, setGptName] = useState("")
  const [gptDescription, setGptDescription] = useState("")
  const [gptInstructions, setGptInstructions] = useState("")
  const [webAccess, setWebAccess] = useState(false)
  const [teamOnly, setTeamOnly] = useState(true)
  const [selectedModel, setSelectedModel] = useState("GPT-4")

  const filteredGPTs = mockTeamGPTs.filter(
    (gpt) =>
      gpt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gpt.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleCreateGPT = () => {
    console.log("Creating GPT:", {
      name: gptName,
      description: gptDescription,
      instructions: gptInstructions,
      webAccess,
      teamOnly,
      model: selectedModel,
    })
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditGPT = (gpt: any) => {
    setSelectedGPT(gpt)
    setGptName(gpt.name)
    setGptDescription(gpt.description)
    setGptInstructions(gpt.instructions)
    setWebAccess(gpt.web_access)
    setTeamOnly(gpt.team_only)
    setSelectedModel(gpt.model)
    setIsEditDialogOpen(true)
  }

  const handleUpdateGPT = () => {
    console.log("Updating GPT:", selectedGPT?.id, {
      name: gptName,
      description: gptDescription,
      instructions: gptInstructions,
      webAccess,
      teamOnly,
      model: selectedModel,
    })
    setIsEditDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setGptName("")
    setGptDescription("")
    setGptInstructions("")
    setWebAccess(false)
    setTeamOnly(true)
    setSelectedModel("GPT-4")
    setSelectedGPT(null)
  }

  const GPTFormDialog = ({ isOpen, onOpenChange, onSubmit, title, submitText }: any) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure your team's AI assistant with custom instructions and capabilities.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gpt-name">GPT Name</Label>
              <Input
                id="gpt-name"
                value={gptName}
                onChange={(e) => setGptName(e.target.value)}
                placeholder="e.g., LegalGPT, FinanceBot"
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpt-model">Model</Label>
              <select
                id="gpt-model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="GPT-4">GPT-4 (Recommended)</option>
                <option value="GPT-3.5">GPT-3.5 Turbo</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpt-description">Description</Label>
            <Input
              id="gpt-description"
              value={gptDescription}
              onChange={(e) => setGptDescription(e.target.value)}
              placeholder="Brief description of what this GPT does"
              className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpt-instructions">System Instructions</Label>
            <Textarea
              id="gpt-instructions"
              value={gptInstructions}
              onChange={(e) => setGptInstructions(e.target.value)}
              placeholder="Detailed instructions for how this GPT should behave and respond..."
              rows={6}
              className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="web-access" className="text-base font-medium">
                  Web Access
                </Label>
                <p className="text-sm text-gray-500">Allow this GPT to browse the internet for current information</p>
              </div>
              <Switch id="web-access" checked={webAccess} onCheckedChange={setWebAccess} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="team-only" className="text-base font-medium">
                  Team Only
                </Label>
                <p className="text-sm text-gray-500">Restrict access to your team members only</p>
              </div>
              <Switch id="team-only" checked={teamOnly} onCheckedChange={setTeamOnly} />
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

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Team GPTs"
      description="Create and manage AI assistants for your team."
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{mockTeamGPTs.length}</p>
                <p className="text-sm text-gray-600">Total GPTs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">
                  {mockTeamGPTs.filter((g) => g.status === "active").length}
                </p>
                <p className="text-sm text-gray-600">Active GPTs</p>
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
                  {mockTeamGPTs.reduce((sum, gpt) => sum + gpt.usage_count, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">
                  {mockTeamGPTs.reduce((sum, gpt) => sum + gpt.active_users, 0)}
                </p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Create */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search GPTs by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create GPT
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GPTs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGPTs.map((gpt) => (
          <Card key={gpt.id} className="border-[#E0E0E0] shadow-none card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#B9E769] rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#2C2C2C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#2C2C2C]">{gpt.name}</h3>
                    <p className="text-sm text-gray-500">{gpt.model}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditGPT(gpt)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit GPT
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View Chats
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                {getStatusBadge(gpt.status)}
                {gpt.web_access && (
                  <Badge variant="outline" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    Web Access
                  </Badge>
                )}
                {gpt.team_only && (
                  <Badge variant="outline" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Team Only
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{gpt.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Usage Count:</span>
                  <span className="font-medium">{gpt.usage_count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Active Users:</span>
                  <span className="font-medium">{gpt.active_users}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Knowledge Files:</span>
                  <span className="font-medium">{gpt.knowledge_files.length}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated {formatDate(gpt.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGPTs.length === 0 && (
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="text-center py-12">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No GPTs found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "No GPTs match your search criteria." : "Create your first team GPT to get started."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First GPT
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create GPT Dialog */}
      <GPTFormDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateGPT}
        title="Create New GPT"
        submitText="Create GPT"
      />

      {/* Edit GPT Dialog */}
      <GPTFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateGPT}
        title="Edit GPT"
        submitText="Update GPT"
      />
    </DashboardLayout>
  )
}
