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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  FolderOpen,
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
    name: "Memory Management",
    href: "/dashboard/admin/memory",
    icon: BookOpen,
    description: "Manage team knowledge base",
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    description: "Team configuration",
  },
]

const mockTeamDocuments = [
  {
    id: "doc-1",
    name: "Team Legal Guidelines 2024.pdf",
    type: "PDF",
    size: "3.2 MB",
    category: "Legal",
    description: "Updated legal guidelines and compliance procedures for the team",
    uploaded_by: "Sarah Johnson",
    uploaded_at: "2024-01-15T10:30:00Z",
    access_level: "Team",
    download_count: 23,
    linked_gpts: ["LegalGPT"],
    status: "active",
  },
  {
    id: "doc-2",
    name: "Financial Reporting Templates.xlsx",
    type: "Excel",
    size: "1.8 MB",
    category: "Finance",
    description: "Standard templates for quarterly and annual financial reports",
    uploaded_by: "Michael Chen",
    uploaded_at: "2024-01-14T14:20:00Z",
    access_level: "Team",
    download_count: 15,
    linked_gpts: ["FinanceBot"],
    status: "active",
  },
  {
    id: "doc-3",
    name: "HR Policy Manual v2.1.docx",
    type: "Word",
    size: "2.5 MB",
    category: "HR",
    description: "Comprehensive HR policies and procedures manual",
    uploaded_by: "HR Team",
    uploaded_at: "2024-01-12T09:15:00Z",
    access_level: "Organization",
    download_count: 45,
    linked_gpts: ["HR Assistant"],
    status: "active",
  },
  {
    id: "doc-4",
    name: "Project Management Guidelines.pdf",
    type: "PDF",
    size: "1.9 MB",
    category: "Operations",
    description: "Best practices and guidelines for project management",
    uploaded_by: "Sarah Johnson",
    uploaded_at: "2024-01-10T16:45:00Z",
    access_level: "Team",
    download_count: 31,
    linked_gpts: [],
    status: "active",
  },
  {
    id: "doc-5",
    name: "Client Onboarding Checklist.pdf",
    type: "PDF",
    size: "890 KB",
    category: "Process",
    description: "Step-by-step checklist for new client onboarding",
    uploaded_by: "Emily Johnson",
    uploaded_at: "2024-01-08T11:30:00Z",
    access_level: "Team",
    download_count: 18,
    linked_gpts: ["HR Assistant"],
    status: "archived",
  },
]

export default function AdminDocumentsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterAccess, setFilterAccess] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [uploadCategory, setUploadCategory] = useState("")
  const [uploadAccess, setUploadAccess] = useState("Team")

  const filteredDocuments = mockTeamDocuments.filter((doc) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleUploadDocument = () => {
    console.log("Uploading document:", {
      title: uploadTitle,
      description: uploadDescription,
      category: uploadCategory,
      access: uploadAccess,
    })
    setIsUploadDialogOpen(false)
    setUploadTitle("")
    setUploadDescription("")
    setUploadCategory("")
    setUploadAccess("Team")
  }

  const categories = ["all", ...Array.from(new Set(mockTeamDocuments.map((doc) => doc.category)))]
  const accessLevels = ["all", "Team", "Organization"]
  const totalSize = mockTeamDocuments.reduce((sum, doc) => {
    const size = Number.parseFloat(doc.size.split(" ")[0])
    const unit = doc.size.split(" ")[1]
    return sum + (unit === "MB" ? size : size / 1000)
  }, 0)

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Team Documents"
      description="Manage your team's document library and knowledge base."
    >
      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{mockTeamDocuments.length}</p>
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FolderOpen className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{categories.length - 1}</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">
                  {mockTeamDocuments.reduce((sum, doc) => sum + doc.download_count, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{totalSize.toFixed(1)} MB</p>
                <p className="text-sm text-gray-600">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Upload */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
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
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-primary">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>Add a new document to your team&apos;s knowledge base.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="upload-file">File</Label>
                      <Input
                        id="upload-file"
                        type="file"
                        className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="upload-title">Title</Label>
                      <Input
                        id="upload-title"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="Document title"
                        className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="upload-description">Description</Label>
                      <Textarea
                        id="upload-description"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        placeholder="Brief description of the document"
                        className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="upload-category">Category</Label>
                        <Input
                          id="upload-category"
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value)}
                          placeholder="e.g., Legal, Finance, HR"
                          className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="upload-access">Access Level</Label>
                        <select
                          id="upload-access"
                          value={uploadAccess}
                          onChange={(e) => setUploadAccess(e.target.value)}
                          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                        >
                          <option value="Team">Team Only</option>
                          <option value="Organization">Organization-wide</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUploadDocument} className="btn-primary">
                      Upload Document
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card className="border-[#E0E0E0] shadow-none mt-6">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">Team Documents</CardTitle>
          <CardDescription>
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
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
                        <p className="text-sm text-gray-500">
                          {doc.size} • {doc.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {doc.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{getAccessBadge(doc.access_level)}</TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Download className="w-3 h-3 text-gray-400" />
                      <span>{doc.download_count}</span>
                    </div>
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
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Brain className="w-4 h-4 mr-2" />
                          Link to GPT
                        </DropdownMenuItem>
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
