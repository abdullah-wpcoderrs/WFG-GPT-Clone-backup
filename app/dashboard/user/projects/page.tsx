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
  Folder,
  Calendar,
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

const mockProjects = [
  {
    id: "project-1",
    name: "Q2 Strategic Planning",
    description: "Strategic analysis and planning documents for Q2 2024",
    chat_count: 8,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T16:30:00Z",
    tags: ["strategy", "planning", "Q2"],
    color: "blue",
  },
  {
    id: "project-2",
    name: "Legal Document Reviews",
    description: "Collection of legal document drafts and reviews",
    chat_count: 12,
    created_at: "2024-01-08T14:20:00Z",
    updated_at: "2024-01-14T11:45:00Z",
    tags: ["legal", "contracts", "review"],
    color: "green",
  },
  {
    id: "project-3",
    name: "HR Policy Updates",
    description: "Updated HR policies and employee handbook revisions",
    chat_count: 5,
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-12T13:20:00Z",
    tags: ["HR", "policy", "handbook"],
    color: "purple",
  },
  {
    id: "project-4",
    name: "Client Onboarding",
    description: "Templates and processes for new client onboarding",
    chat_count: 6,
    created_at: "2024-01-03T11:30:00Z",
    updated_at: "2024-01-11T15:10:00Z",
    tags: ["onboarding", "clients", "process"],
    color: "orange",
  },
]

export default function ProjectsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 border-blue-200 text-blue-800"
      case "green":
        return "bg-green-100 border-green-200 text-green-800"
      case "purple":
        return "bg-purple-100 border-purple-200 text-purple-800"
      case "orange":
        return "bg-orange-100 border-orange-200 text-orange-800"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800"
    }
  }

  const handleCreateProject = () => {
    // In a real app, this would create the project via API
    console.log("Creating project:", { name: newProjectName, description: newProjectDescription })
    setIsCreateDialogOpen(false)
    setNewProjectName("")
    setNewProjectDescription("")
  }

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="My Projects"
      description="Organize your chats and outputs into named projects for better management."
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
                  placeholder="Search projects by name, description, or tags..."
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
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>Create a new project to organize your chats and outputs.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} className="btn-primary">
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className={`border shadow-none card-hover cursor-pointer ${getColorClasses(project.color)}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-white/20">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Open Project</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>Export All</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Project</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm mb-4 opacity-80">{project.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-white/30">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm opacity-70">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{project.chat_count} chats</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(project.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="text-center py-12">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "No projects match your search criteria."
                : "Create your first project to organize your chats and outputs."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </DashboardLayout>
  )
}
