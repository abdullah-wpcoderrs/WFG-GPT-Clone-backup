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
  Copy,
  Star,
  Globe,
  Edit,
  Trash2,
  TrendingUp,
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

const mockTeamTemplates = [
  {
    id: "template-1",
    title: "Legal Document Analysis",
    content:
      "Please analyze the following legal document for compliance, risks, and key terms. Provide a summary of important clauses and highlight any areas that require attention: [DOCUMENT]",
    category: "Legal",
    usage_count: 45,
    created_at: "2024-01-10T10:00:00Z",
    created_by: "Sarah Johnson",
    is_organization_wide: false,
    is_recommended: true,
    linked_gpts: ["LegalGPT"],
  },
  {
    id: "template-2",
    title: "Financial Report Summary",
    content:
      "Create a comprehensive executive summary of the following financial report, highlighting key metrics, trends, and actionable insights: [REPORT_DATA]",
    category: "Finance",
    usage_count: 32,
    created_at: "2024-01-08T14:20:00Z",
    created_by: "Michael Chen",
    is_organization_wide: true,
    is_recommended: true,
    linked_gpts: ["FinanceBot"],
  },
  {
    id: "template-3",
    title: "Meeting Minutes Generator",
    content:
      "Transform the following meeting notes into professional meeting minutes with clear action items, decisions made, and next steps: [MEETING_NOTES]",
    category: "Productivity",
    usage_count: 67,
    created_at: "2024-01-05T09:15:00Z",
    created_by: "Emily Johnson",
    is_organization_wide: false,
    is_recommended: false,
    linked_gpts: [],
  },
  {
    id: "template-4",
    title: "HR Policy Explanation",
    content:
      "Explain the following HR policy in simple, employee-friendly language. Include examples and address common questions: [POLICY_TEXT]",
    category: "HR",
    usage_count: 28,
    created_at: "2024-01-03T11:30:00Z",
    created_by: "HR Team",
    is_organization_wide: true,
    is_recommended: false,
    linked_gpts: ["HR Assistant"],
  },
]

export default function AdminTemplatesPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Form states
  const [templateTitle, setTemplateTitle] = useState("")
  const [templateContent, setTemplateContent] = useState("")
  const [templateCategory, setTemplateCategory] = useState("")
  const [isOrgWide, setIsOrgWide] = useState(false)
  const [isRecommended, setIsRecommended] = useState(false)

  const filteredTeamTemplates = mockTeamTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateTemplate = () => {
    console.log("Creating template:", {
      title: templateTitle,
      content: templateContent,
      category: templateCategory,
      isOrgWide,
      isRecommended,
    })
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template)
    setTemplateTitle(template.title)
    setTemplateContent(template.content)
    setTemplateCategory(template.category)
    setIsOrgWide(template.is_organization_wide)
    setIsRecommended(template.is_recommended)
    setIsEditDialogOpen(true)
  }

  const handleUpdateTemplate = () => {
    console.log("Updating template:", selectedTemplate?.id, {
      title: templateTitle,
      content: templateContent,
      category: templateCategory,
      isOrgWide,
      isRecommended,
    })
    setIsEditDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setTemplateTitle("")
    setTemplateContent("")
    setTemplateCategory("")
    setIsOrgWide(false)
    setIsRecommended(false)
    setSelectedTemplate(null)
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    console.log("Copied to clipboard")
  }

  const TemplateFormDialog = ({ isOpen, onOpenChange, onSubmit, title, submitText }: any) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Create reusable prompt templates for your team to improve consistency.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-title">Template Title</Label>
              <Input
                id="template-title"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                placeholder="e.g., Legal Document Analysis"
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-category">Category</Label>
              <Input
                id="template-category"
                value={templateCategory}
                onChange={(e) => setTemplateCategory(e.target.value)}
                placeholder="e.g., Legal, Finance, HR"
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-content">Template Content</Label>
            <Textarea
              id="template-content"
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
              placeholder="Enter your prompt template. Use [PLACEHOLDER] for dynamic content..."
              rows={8}
              className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="org-wide" className="text-base font-medium">
                  Organization-wide
                </Label>
                <p className="text-sm text-gray-500">Make this template available to all teams</p>
              </div>
              <Switch id="org-wide" checked={isOrgWide} onCheckedChange={setIsOrgWide} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="recommended" className="text-base font-medium">
                  Recommended
                </Label>
                <p className="text-sm text-gray-500">Mark this template as recommended for users</p>
              </div>
              <Switch id="recommended" checked={isRecommended} onCheckedChange={setIsRecommended} />
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

  const TemplateCard = ({ template }: { template: any }) => (
    <Card className="border-[#E0E0E0] shadow-none card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-[#2C2C2C]">{template.title}</h3>
            {template.is_recommended && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                <Star className="w-3 h-3 mr-1" />
                Recommended
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => copyToClipboard(template.content)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Template
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="w-4 h-4 mr-2" />
                Use in Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Template
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {template.category}
          </Badge>
          {template.is_organization_wide && (
            <Badge variant="outline" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Organization-wide
            </Badge>
          )}
          {template.linked_gpts.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <Brain className="w-3 h-3 mr-1" />
              {template.linked_gpts.length} GPT{template.linked_gpts.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.content}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Used {template.usage_count} times</span>
          </div>
          <span>By {template.created_by}</span>
        </div>
      </CardContent>
    </Card>
  )

  const totalUsage = mockTeamTemplates.reduce((sum, template) => sum + template.usage_count, 0)
  const recommendedCount = mockTeamTemplates.filter((t) => t.is_recommended).length
  const orgWideCount = mockTeamTemplates.filter((t) => t.is_organization_wide).length

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Prompt Templates"
      description="Create and manage reusable prompt templates for your team."
    >
      {/* Template Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{mockTeamTemplates.length}</p>
                <p className="text-sm text-gray-600">Total Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{recommendedCount}</p>
                <p className="text-sm text-gray-600">Recommended</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{orgWideCount}</p>
                <p className="text-sm text-gray-600">Organization-wide</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{totalUsage}</p>
                <p className="text-sm text-gray-600">Total Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Create */}
      <Card className="border-[#E0E0E0] shadow-none mt-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search templates by title, content, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {filteredTeamTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {filteredTeamTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "No templates match your search criteria."
                : "Create your first prompt template to get started."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Template Dialog */}
      <TemplateFormDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTemplate}
        title="Create New Template"
        submitText="Create Template"
      />

      {/* Edit Template Dialog */}
      <TemplateFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateTemplate}
        title="Edit Template"
        submitText="Update Template"
      />
    </DashboardLayout>
  )
}
