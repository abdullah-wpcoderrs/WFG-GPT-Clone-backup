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
  Brain,
  MessageSquare,
  FolderOpen,
  BookOpen,
  FileText,
  Settings,
  Search,
  MoreHorizontal,
  Download,
  Eye,
  Calendar,
  User,
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

const mockDocuments = [
  {
    id: "doc-1",
    name: "Strategic Planning Guidelines 2024.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploaded_by: "Sarah Johnson",
    uploaded_at: "2024-01-15T10:30:00Z",
    access_level: "Team",
    category: "Strategy",
    description: "Comprehensive guidelines for strategic planning processes",
  },
  {
    id: "doc-2",
    name: "Legal Compliance Checklist.docx",
    type: "Word",
    size: "856 KB",
    uploaded_by: "Michael Chen",
    uploaded_at: "2024-01-14T14:20:00Z",
    access_level: "Organization",
    category: "Legal",
    description: "Standard checklist for legal compliance reviews",
  },
  {
    id: "doc-3",
    name: "Employee Handbook v3.2.pdf",
    type: "PDF",
    size: "4.1 MB",
    uploaded_by: "HR Team",
    uploaded_at: "2024-01-12T09:15:00Z",
    access_level: "Organization",
    category: "HR",
    description: "Updated employee handbook with new policies",
  },
  {
    id: "doc-4",
    name: "Q4 Financial Report Template.xlsx",
    type: "Excel",
    size: "1.2 MB",
    uploaded_by: "Finance Team",
    uploaded_at: "2024-01-10T16:45:00Z",
    access_level: "Team",
    category: "Finance",
    description: "Template for quarterly financial reporting",
  },
  {
    id: "doc-5",
    name: "Client Onboarding Process.pptx",
    type: "PowerPoint",
    size: "3.8 MB",
    uploaded_by: "Sarah Johnson",
    uploaded_at: "2024-01-08T11:30:00Z",
    access_level: "Team",
    category: "Process",
    description: "Step-by-step client onboarding presentation",
  },
]

export default function DocumentsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterAccess, setFilterAccess] = useState("all")

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || doc.category.toLowerCase() === filterCategory.toLowerCase()
    const matchesAccess = filterAccess === "all" || doc.access_level.toLowerCase() === filterAccess.toLowerCase()
    return matchesSearch && matchesCategory && matchesAccess
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "📄"
      case "word":
        return "📝"
      case "excel":
        return "📊"
      case "powerpoint":
        return "📋"
      default:
        return "📄"
    }
  }

  const getAccessBadge = (access: string) => {
    switch (access) {
      case "Organization":
        return <Badge className="bg-blue-100 text-blue-800">Organization-wide</Badge>
      case "Team":
        return <Badge className="bg-green-100 text-green-800">Team Only</Badge>
      default:
        return <Badge>{access}</Badge>
    }
  }

  const categories = ["all", ...Array.from(new Set(mockDocuments.map((doc) => doc.category)))]
  const accessLevels = ["all", "Team", "Organization"]

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Team Documents"
      description="Access documents shared with your team and organization-wide resources."
    >
      {/* Search and Filters */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search documents by name, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <select
                value={filterAccess}
                onChange={(e) => setFilterAccess(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                {accessLevels.map((access) => (
                  <option key={access} value={access}>
                    {access === "all" ? "All Access Levels" : access}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">Available Documents</CardTitle>
          <CardDescription>
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFileIcon(doc.type)}</span>
                      <div>
                        <p className="font-medium text-[#2C2C2C]">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {doc.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{getAccessBadge(doc.access_level)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{doc.size}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <User className="w-3 h-3" />
                      <span>{doc.uploaded_by}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(doc.uploaded_at)}</span>
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
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Use in Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No documents found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
