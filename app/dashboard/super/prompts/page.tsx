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
  Plus,
  Copy,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Globe,
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

const mockPrompts = [
  {
    id: "prompt-1",
    title: "Legal Document Analysis",
    description: "Comprehensive prompt for analyzing legal documents and identifying key clauses",
    content:
      "You are a legal expert assistant. Analyze the following document and provide: 1) Key legal clauses, 2) Potential risks, 3) Compliance requirements, 4) Recommendations for improvement...",
    category: "Legal",
    team_name: "Strategic Support Team",
    team_id: "team-1",
    created_by: "Sarah Johnson",
    created_by_id: "admin-1",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
    access_level: "organization",
    status: "active",
    usage_count: 234,
    rating: 4.8,
    tags: ["legal", "analysis", "compliance"],
    is_featured: true,
    version: "2.1",
  },
  {
    id: "prompt-2",
    title: "Financial Report Generator",
    description: "Template for generating comprehensive financial reports with analysis",
    content:
      "Create a detailed financial report based on the provided data. Include: 1) Executive summary, 2) Key metrics analysis, 3) Trend identification, 4) Risk assessment, 5) Recommendations...",
    category: "Finance",
    team_name: "Finance Team",
    team_id: "team-2",
    created_by: "Michael Chen",
    created_by_id: "admin-2",
    created_at: "2024-01-08T14:20:00Z",
    updated_at: "2024-01-14T11:45:00Z",
    access_level: "team",
    status: "active",
    usage_count: 156,
    rating: 4.6,
    tags: ["finance", "reporting", "analysis"],
    is_featured: false,
    version: "1.3",
  },
  {
    id: "prompt-3",
    title: "Training Content Creator",
    description: "Comprehensive prompt for creating engaging training materials and courses",
    content:
      "You are an instructional designer. Create engaging training content that includes: 1) Learning objectives, 2) Interactive exercises, 3) Assessment questions, 4) Real-world examples...",
    category: "Training",
    team_name: "Learning and Development",
    team_id: "team-3",
    created_by: "Emily Rodriguez",
    created_by_id: "admin-3",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-15T16:20:00Z",
    access_level: "organization",
    status: "active",
    usage_count: 189,
    rating: 4.9,
    tags: ["training", "education", "content"],
    is_featured: true,
    version: "3.0",
  },
  {
    id: "prompt-4",
    title: "Market Research Analyzer",
    description: "Advanced prompt for analyzing market trends and competitive landscape",
    content:
      "Conduct comprehensive market research analysis including: 1) Market size and trends, 2) Competitive analysis, 3) Customer insights, 4) Growth opportunities...",
    category: "Marketing",
    team_name: "Revenue Growth Unit",
    team_id: "team-5",
    created_by: "Lisa Thompson",
    created_by_id: "admin-5",
    created_at: "2024-01-12T09:15:00Z",
    updated_at: "2024-01-12T16:20:00Z",
    access_level: "team",
    status: "pending",
    usage_count: 67,
    rating: 4.4,
    tags: ["marketing", "research", "analysis"],
    is_featured: false,
    version: "1.0",
  },
  {
    id: "prompt-5",
    title: "Code Review Assistant",
    description: "Technical prompt for comprehensive code review and optimization suggestions",
    content:
      "Review the provided code and provide: 1) Code quality assessment, 2) Security vulnerabilities, 3) Performance optimizations, 4) Best practices recommendations...",
    category: "Technical",
    team_name: "Business Development Unit",
    team_id: "team-6",
    created_by: "Robert Kim",
    created_by_id: "admin-6",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-10T12:30:00Z",
    access_level: "organization",
    status: "active",
    usage_count: 298,
    rating: 4.7,
    tags: ["technical", "code", "review"],
    is_featured: false,
    version: "2.0",
  },
]

export default function SuperPromptsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTeam, setFilterTeam] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterAccess, setFilterAccess] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null)

  // Form states
  const [promptTitle, setPromptTitle] = useState("")
  const [promptDescription, setPromptDescription] = useState("")
  const [promptContent, setPromptContent] = useState("")
  const [promptCategory, setPromptCategory] = useState("")
  const [promptTags, setPromptTags] = useState("")

  const filteredPrompts = mockPrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTeam = filterTeam === "all" || prompt.team_id === filterTeam
    const matchesCategory = filterCategory === "all" || prompt.category.toLowerCase() === filterCategory.toLowerCase()
    const matchesAccess = filterAccess === "all" || prompt.access_level === filterAccess
    const matchesStatus = filterStatus === "all" || prompt.status === filterStatus
    return matchesSearch && matchesTeam && matchesCategory && matchesAccess && matchesStatus
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
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getAccessBadge = (access: string) => {
    switch (access) {
      case "organization":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Globe className="w-3 h-3 mr-1" />
            Organization
          </Badge>
        )
      case "team":
        return <Badge className="bg-green-100 text-green-800">Team</Badge>
      case "private":
        return <Badge className="bg-gray-100 text-gray-800">Private</Badge>
      default:
        return <Badge>{access}</Badge>
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Legal: "bg-purple-100 text-purple-800",
      Finance: "bg-green-100 text-green-800",
      Training: "bg-blue-100 text-blue-800",
      Marketing: "bg-orange-100 text-orange-800",
      Technical: "bg-red-100 text-red-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const handleSelectPrompt = (promptId: string, checked: boolean) => {
    if (checked) {
      setSelectedPrompts([...selectedPrompts, promptId])
    } else {
      setSelectedPrompts(selectedPrompts.filter((id) => id !== promptId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrompts(filteredPrompts.map((prompt) => prompt.id))
    } else {
      setSelectedPrompts([])
    }
  }

  const handleViewPrompt = (prompt: any) => {
    setSelectedPrompt(prompt)
    setIsViewDialogOpen(true)
  }

  const handleCreatePrompt = () => {
    console.log("Creating prompt:", {
      title: promptTitle,
      description: promptDescription,
      content: promptContent,
      category: promptCategory,
      tags: promptTags,
    })
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setPromptTitle("")
    setPromptDescription("")
    setPromptContent("")
    setPromptCategory("")
    setPromptTags("")
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for prompts:`, selectedPrompts)
    setSelectedPrompts([])
  }

  const uniqueTeams = Array.from(new Set(mockPrompts.map((prompt) => ({ id: prompt.team_id, name: prompt.team_name }))))
  const uniqueCategories = Array.from(new Set(mockPrompts.map((prompt) => prompt.category)))
  const totalUsage = mockPrompts.reduce((sum, prompt) => sum + prompt.usage_count, 0)
  const avgRating = mockPrompts.reduce((sum, prompt) => sum + prompt.rating, 0) / mockPrompts.length
  const featuredCount = mockPrompts.filter((prompt) => prompt.is_featured).length
  const pendingCount = mockPrompts.filter((prompt) => prompt.status === "pending").length

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Prompt Library"
      description="Manage and organize prompt templates across the organization."
    >
      {/* Prompt Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{mockPrompts.length}</p>
                <p className="text-sm text-gray-600">Total Prompts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{totalUsage.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{avgRating.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{featuredCount}</p>
                <p className="text-sm text-gray-600">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
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
                  placeholder="Search prompts by title, description, or tags..."
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
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={filterAccess}
                onChange={(e) => setFilterAccess(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Access</option>
                <option value="organization">Organization</option>
                <option value="team">Team</option>
                <option value="private">Private</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Prompt
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedPrompts.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedPrompts.length} prompt{selectedPrompts.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("approve")}>
                    Bulk Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("feature")}>
                    Bulk Feature
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
                    Bulk Export
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

      {/* Prompts Table */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">Organization Prompts</CardTitle>
          <CardDescription>
            {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedPrompts.length === filteredPrompts.length && filteredPrompts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Prompt & Team</TableHead>
                <TableHead>Category & Access</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status & Version</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrompts.map((prompt) => (
                <TableRow key={prompt.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedPrompts.includes(prompt.id)}
                      onCheckedChange={(checked) => handleSelectPrompt(prompt.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#B9E769] rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-[#2C2C2C]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-[#2C2C2C]">{prompt.title}</p>
                          {prompt.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">{prompt.description}</p>
                        <p className="text-xs text-gray-400">{prompt.team_name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getCategoryColor(prompt.category)}>{prompt.category}</Badge>
                      {getAccessBadge(prompt.access_level)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <MessageSquare className="w-3 h-3 text-gray-400" />
                        <span>{prompt.usage_count} uses</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{prompt.rating.toFixed(1)} rating</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {prompt.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{prompt.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(prompt.status)}
                      <div className="text-xs text-gray-500">v{prompt.version}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(prompt.created_at)}</span>
                      </div>
                      <div className="text-xs text-gray-500">by {prompt.created_by}</div>
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
                        <DropdownMenuItem onClick={() => handleViewPrompt(prompt)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Prompt
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Prompt
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Prompt
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        {!prompt.is_featured && (
                          <DropdownMenuItem>
                            <Star className="w-4 h-4 mr-2" />
                            Feature Prompt
                          </DropdownMenuItem>
                        )}
                        {prompt.status === "pending" && (
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
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

          {filteredPrompts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No prompts found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Prompt Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Prompt</DialogTitle>
            <DialogDescription>Create a new prompt template for the organization.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prompt-title">Prompt Title</Label>
                <Input
                  id="prompt-title"
                  placeholder="Enter prompt title"
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                  className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt-category">Category</Label>
                <select
                  value={promptCategory}
                  onChange={(e) => setPromptCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                >
                  <option value="">Select category</option>
                  {uniqueCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt-description">Description</Label>
              <Textarea
                id="prompt-description"
                placeholder="Describe what this prompt does and when to use it"
                value={promptDescription}
                onChange={(e) => setPromptDescription(e.target.value)}
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt-content">Prompt Content</Label>
              <Textarea
                id="prompt-content"
                placeholder="Enter the full prompt template here..."
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                rows={8}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prompt-access">Access Level</Label>
                <select className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]">
                  <option value="team">Team Only</option>
                  <option value="organization">Organization Wide</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt-tags">Tags</Label>
                <Input
                  id="prompt-tags"
                  placeholder="Enter tags separated by commas"
                  value={promptTags}
                  onChange={(e) => setPromptTags(e.target.value)}
                  className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="featured" />
              <Label htmlFor="featured" className="text-sm">
                Mark as featured prompt
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePrompt} className="btn-primary">
              Create Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Prompt Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>{selectedPrompt?.title}</span>
              {selectedPrompt?.is_featured && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
            </DialogTitle>
            <DialogDescription>{selectedPrompt?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Category</Label>
                <Badge className={getCategoryColor(selectedPrompt?.category || "")}>{selectedPrompt?.category}</Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Usage Count</Label>
                <p className="text-sm font-medium">{selectedPrompt?.usage_count} uses</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Rating</Label>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{selectedPrompt?.rating}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Version</Label>
                <p className="text-sm font-medium">v{selectedPrompt?.version}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Prompt Content</Label>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{selectedPrompt?.content}</pre>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Label className="text-sm font-medium text-gray-500">Tags:</Label>
              {selectedPrompt?.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <Label className="text-sm font-medium text-gray-500">Created by</Label>
                <p>{selectedPrompt?.created_by}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Team</Label>
                <p>{selectedPrompt?.team_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Created</Label>
                <p>{formatDate(selectedPrompt?.created_at || "")}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                <p>{formatDate(selectedPrompt?.updated_at || "")}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button className="btn-primary">
              <Copy className="w-4 h-4 mr-2" />
              Copy Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
