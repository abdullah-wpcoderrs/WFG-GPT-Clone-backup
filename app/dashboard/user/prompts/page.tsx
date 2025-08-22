"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Brain,
  MessageSquare,
  FolderOpen,
  BookOpen,
  FileText,
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  Star,
  Globe,
} from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard/user",
    icon: Brain,
    description: "Overview",
  },
  {
    name: "Messages",
    href: "/dashboard/user/messages",
    icon: MessageSquare,
    description: "Team conversations",
  },
  {
    name: "My Chats",
    href: "/dashboard/user/chats",
    icon: MessageSquare,
    description: "AI chat history",
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
    description: "Saved prompt",
  },
  {
    name: "Team Documents",
    href: "/dashboard/user/documents",
    icon: FileText,
    description: "Shared team files",
  },
  {
    name: "Settings",
    href: "/dashboard/user/settings",
    icon: Settings,
    description: "Profile & preferences",
  },
]

const mockPersonalPrompts = [
  {
    id: "prompt-1",
    title: "Legal Document Review",
    content:
      "Please review the following document for legal compliance and highlight any potential issues or areas that need attention: [DOCUMENT]",
    category: "Legal",
    usage_count: 15,
    created_at: "2024-01-10T10:00:00Z",
    is_favorite: true,
  },
  {
    id: "prompt-2",
    title: "Meeting Summary Generator",
    content:
      "Create a comprehensive meeting summary from the following notes, including key decisions, action items, and next steps: [MEETING_NOTES]",
    category: "Productivity",
    usage_count: 8,
    created_at: "2024-01-08T14:20:00Z",
    is_favorite: false,
  },
  {
    id: "prompt-3",
    title: "Email Draft Assistant",
    content:
      "Help me draft a professional email for the following situation. Make it clear, concise, and appropriately formal: [SITUATION]",
    category: "Communication",
    usage_count: 22,
    created_at: "2024-01-05T09:15:00Z",
    is_favorite: true,
  },
]

const mockOrgPrompts = [
  {
    id: "org-prompt-1",
    title: "Strategic Analysis Template",
    content:
      "Conduct a strategic analysis of the following business scenario, including SWOT analysis, market assessment, and recommendations: [SCENARIO]",
    category: "Strategy",
    usage_count: 45,
    created_by: "Super Admin",
    is_recommended: true,
  },
  {
    id: "org-prompt-2",
    title: "Policy Compliance Check",
    content:
      "Review the following content for compliance with company policies and regulations. Highlight any violations or areas of concern: [CONTENT]",
    category: "Compliance",
    usage_count: 32,
    created_by: "Admin Team",
    is_recommended: false,
  },
  {
    id: "org-prompt-3",
    title: "Report Executive Summary",
    content:
      "Create an executive summary for the following report, highlighting key findings, insights, and actionable recommendations: [REPORT]",
    category: "Reporting",
    usage_count: 67,
    created_by: "Super Admin",
    is_recommended: true,
  },
]

export default function PromptsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPromptTitle, setNewPromptTitle] = useState("")
  const [newPromptContent, setNewPromptContent] = useState("")
  const [newPromptCategory, setNewPromptCategory] = useState("")

  const filteredPersonalPrompts = mockPersonalPrompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredOrgPrompts = mockOrgPrompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreatePrompt = () => {
    // In a real app, this would create the prompt via API
    console.log("Creating prompt:", { title: newPromptTitle, content: newPromptContent, category: newPromptCategory })
    setIsCreateDialogOpen(false)
    setNewPromptTitle("")
    setNewPromptContent("")
    setNewPromptCategory("")
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    // In a real app, show a toast notification
    console.log("Copied to clipboard")
  }

  const PromptCard = ({ prompt, isOrgWide = false }: { prompt: any; isOrgWide?: boolean }) => (
    <Card className="border-[#E0E0E0] shadow-none card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-[#2C2C2C]">{prompt.title}</h3>
            {isOrgWide && prompt.is_recommended && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                <Star className="w-3 h-3 mr-1" />
                Recommended
              </Badge>
            )}
            {!isOrgWide && prompt.is_favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => copyToClipboard(prompt.content)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Prompt
              </DropdownMenuItem>
              <DropdownMenuItem>Use in Chat</DropdownMenuItem>
              {!isOrgWide && (
                <>
                  <DropdownMenuItem>Edit Prompt</DropdownMenuItem>
                  <DropdownMenuItem>
                    {prompt.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {prompt.category}
          </Badge>
          {isOrgWide && (
            <Badge variant="outline" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Organization-wide
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{prompt.content}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Used {prompt.usage_count} times</span>
          {isOrgWide ? (
            <span>By {prompt.created_by}</span>
          ) : (
            <span>Created {new Date(prompt.created_at).toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Prompt Library"
      description="Manage your personal prompt templates and access organization-wide prompts."
    >
      <div className="space-y-6">
      {/* Search and Create */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search prompts by title, content, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Prompt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Prompt</DialogTitle>
                  <DialogDescription>
                    Create a reusable prompt template for your future conversations.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt-title">Prompt Title</Label>
                    <Input
                      id="prompt-title"
                      value={newPromptTitle}
                      onChange={(e) => setNewPromptTitle(e.target.value)}
                      placeholder="Enter a descriptive title"
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prompt-category">Category</Label>
                    <Input
                      id="prompt-category"
                      value={newPromptCategory}
                      onChange={(e) => setNewPromptCategory(e.target.value)}
                      placeholder="e.g., Legal, Productivity, Communication"
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prompt-content">Prompt Content</Label>
                    <Textarea
                      id="prompt-content"
                      value={newPromptContent}
                      onChange={(e) => setNewPromptContent(e.target.value)}
                      placeholder="Enter your prompt template. Use [PLACEHOLDER] for dynamic content."
                      rows={6}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
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
          </div>
        </CardContent>
      </Card>

      {/* Prompt Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">My Prompts ({filteredPersonalPrompts.length})</TabsTrigger>
          <TabsTrigger value="organization">Organization-wide ({filteredOrgPrompts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          {filteredPersonalPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPersonalPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <Card className="border-[#E0E0E0] shadow-none">
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No personal prompts found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? "No prompts match your search criteria."
                    : "Create your first prompt template to get started."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Prompt
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          {filteredOrgPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOrgPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} isOrgWide={true} />
              ))}
            </div>
          ) : (
            <Card className="border-[#E0E0E0] shadow-none">
              <CardContent className="text-center py-12">
                <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No organization prompts found</h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? "No organization-wide prompts match your search criteria."
                    : "No organization-wide prompts are available yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  )
}
