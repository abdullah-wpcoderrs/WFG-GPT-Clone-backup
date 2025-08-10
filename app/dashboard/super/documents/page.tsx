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
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  Share,
  Lock,
  Unlock,
  Calendar,
  File,
  ImageIcon,
  Video,
  Archive,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
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
    description: "Org GPT management",
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
    description: "Team structure",
  },
  {
    name: "Document Library",
    href: "/dashboard/super/documents",
    icon: FileText,
    description: "Document management",
  },
  {
    name: "Prompt Library",
    href: "/dashboard/super/prompts",
    icon: BookOpen,
    description: "Org Prompt templates",
  },
  // New navigation item for personal chat history
  {
    name: "Chat History", 
    href: "/dashboard/super/chats",
    icon: MessageSquare,
    description: "Chat logs",
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

const mockDocuments = [
  {
    id: "doc-1",
    name: "Company Policy Manual 2024",
    description: "Comprehensive company policies and procedures",
    type: "pdf",
    size: "2.4 MB",
    team_name: "Strategic Support Team",
    team_id: "team-1",
    uploaded_by: "Sarah Johnson",
    uploaded_by_id: "admin-1",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
    access_level: "organization",
    status: "active",
    downloads: 156,
    views: 423,
    tags: ["policy", "hr", "compliance"],
    is_sensitive: true,
    version: "2.1",
  },
  {
    id: "doc-2",
    name: "Financial Report Q4 2023",
    description: "Quarterly financial analysis and projections",
    type: "xlsx",
    size: "1.8 MB",
    team_name: "Finance Team",
    team_id: "team-2",
    uploaded_by: "Michael Chen",
    uploaded_by_id: "admin-2",
    created_at: "2024-01-08T14:20:00Z",
    updated_at: "2024-01-14T11:45:00Z",
    access_level: "team",
    status: "active",
    downloads: 89,
    views: 234,
    tags: ["finance", "quarterly", "report"],
    is_sensitive: true,
    version: "1.0",
  },
  {
    id: "doc-3",
    name: "Training Materials - AI Best Practices",
    description: "Comprehensive guide for AI tool usage and best practices",
    type: "pptx",
    size: "5.2 MB",
    team_name: "Learning and Development",
    team_id: "team-3",
    uploaded_by: "Emily Rodriguez",
    uploaded_by_id: "admin-3",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-15T16:20:00Z",
    access_level: "organization",
    status: "active",
    downloads: 267,
    views: 589,
    tags: ["training", "ai", "best-practices"],
    is_sensitive: false,
    version: "3.0",
  },
  {
    id: "doc-4",
    name: "Project Proposal - Digital Transformation",
    description: "Strategic proposal for company-wide digital transformation",
    type: "docx",
    size: "892 KB",
    team_name: "Revenue Growth Unit",
    team_id: "team-5",
    uploaded_by: "Lisa Thompson",
    uploaded_by_id: "admin-5",
    created_at: "2024-01-12T09:15:00Z",
    updated_at: "2024-01-12T16:20:00Z",
    access_level: "restricted",
    status: "pending",
    downloads: 23,
    views: 67,
    tags: ["proposal", "strategy", "digital"],
    is_sensitive: true,
    version: "1.2",
  },
  {
    id: "doc-5",
    name: "Marketing Assets Collection",
    description: "Brand guidelines, logos, and marketing materials",
    type: "zip",
    size: "15.6 MB",
    team_name: "Business Development Unit",
    team_id: "team-6",
    uploaded_by: "Robert Kim",
    uploaded_by_id: "admin-6",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-10T12:30:00Z",
    access_level: "organization",
    status: "active",
    downloads: 134,
    views: 298,
    tags: ["marketing", "brand", "assets"],
    is_sensitive: false,
    version: "2.5",
  },
]

export default function SuperDocumentsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTeam, setFilterTeam] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterAccess, setFilterAccess] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [actionType, setActionType] = useState<"approve" | "restrict" | "delete">("approve")

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTeam = filterTeam === "all" || doc.team_id === filterTeam
    const matchesType = filterType === "all" || doc.type === filterType
    const matchesAccess = filterAccess === "all" || doc.access_level === filterAccess
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus
    return matchesSearch && matchesTeam && matchesType && matchesAccess && matchesStatus
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
        return <File className="w-4 h-4 text-red-500" />
      case "docx":
      case "doc":
        return <File className="w-4 h-4 text-blue-500" />
      case "xlsx":
      case "xls":
        return <File className="w-4 h-4 text-green-500" />
      case "pptx":
      case "ppt":
        return <File className="w-4 h-4 text-orange-500" />
      case "zip":
      case "rar":
        return <Archive className="w-4 h-4 text-purple-500" />
      case "jpg":
      case "png":
      case "gif":
        return <ImageIcon className="w-4 h-4 text-pink-500" />
      case "mp4":
      case "avi":
        return <Video className="w-4 h-4 text-indigo-500" />
      default:
        return <File className="w-4 h-4 text-gray-500" />
    }
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
      case "restricted":
        return (
          <Badge className="bg-red-100 text-red-800">
            <Lock className="w-3 h-3 mr-1" />
            Restricted
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getAccessBadge = (access: string) => {
    switch (access) {
      case "organization":
        return <Badge className="bg-blue-100 text-blue-800">Organization</Badge>
      case "team":
        return <Badge className="bg-green-100 text-green-800">Team</Badge>
      case "restricted":
        return <Badge className="bg-red-100 text-red-800">Restricted</Badge>
      default:
        return <Badge>{access}</Badge>
    }
  }

  const handleSelectDoc = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocs([...selectedDocs, docId])
    } else {
      setSelectedDocs(selectedDocs.filter((id) => id !== docId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocs(filteredDocuments.map((doc) => doc.id))
    } else {
      setSelectedDocs([])
    }
  }

  const handleDocAction = (doc: any, action: "approve" | "restrict" | "delete") => {
    setSelectedDoc(doc)
    setActionType(action)
    setIsActionDialogOpen(true)
  }

  const handleSubmitAction = () => {
    console.log(`${actionType} document:`, selectedDoc?.id)
    setIsActionDialogOpen(false)
    setSelectedDoc(null)
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for documents:`, selectedDocs)
    setSelectedDocs([])
  }

  const uniqueTeams = Array.from(new Set(mockDocuments.map((doc) => ({ id: doc.team_id, name: doc.team_name }))))
  const uniqueTypes = Array.from(new Set(mockDocuments.map((doc) => doc.type)))
  const totalSize = mockDocuments.reduce((sum, doc) => {
    const sizeInMB = Number.parseFloat(doc.size.replace(/[^\d.]/g, ""))
    return sum + (doc.size.includes("KB") ? sizeInMB / 1024 : sizeInMB)
  }, 0)
  const totalDownloads = mockDocuments.reduce((sum, doc) => sum + doc.downloads, 0)
  const sensitiveCount = mockDocuments.filter((doc) => doc.is_sensitive).length
  const pendingCount = mockDocuments.filter((doc) => doc.status === "pending").length

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Document Library"
      description="Manage and monitor all documents across the organization."
    >
      <div className="space-y-6">
      {/* Document Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{mockDocuments.length}</p>
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Archive className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{totalSize.toFixed(1)} GB</p>
                <p className="text-sm text-gray-600">Total Storage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{totalDownloads}</p>
                <p className="text-sm text-gray-600">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Lock className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{sensitiveCount}</p>
                <p className="text-sm text-gray-600">Sensitive Docs</p>
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
                  placeholder="Search documents by name, description, or tags..."
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
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
                <option value="restricted">Restricted</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
            <Button onClick={() => setIsUploadDialogOpen(true)} className="btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedDocs.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedDocs.length} document{selectedDocs.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("approve")}>
                    Bulk Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("restrict")}>
                    Bulk Restrict
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("download")}>
                    Bulk Download
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

      {/* Documents Table */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">Organization Documents</CardTitle>
          <CardDescription>
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedDocs.length === filteredDocuments.length && filteredDocuments.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Document & Team</TableHead>
                <TableHead>Type & Size</TableHead>
                <TableHead>Access & Status</TableHead>
                <TableHead>Usage Stats</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={(checked) => handleSelectDoc(doc.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(doc.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-[#2C2C2C]">{doc.name}</p>
                          {doc.is_sensitive && <Lock className="w-3 h-3 text-red-500" />}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">{doc.description}</p>
                        <p className="text-xs text-gray-400">{doc.team_name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {doc.type.toUpperCase()}
                      </Badge>
                      <div className="text-sm text-gray-600">{doc.size}</div>
                      <div className="text-xs text-gray-500">v{doc.version}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getAccessBadge(doc.access_level)}
                      {getStatusBadge(doc.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Eye className="w-3 h-3 text-gray-400" />
                        <span>{doc.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Download className="w-3 h-3 text-gray-400" />
                        <span>{doc.downloads} downloads</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{doc.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(doc.created_at)}</span>
                      </div>
                      <div className="text-xs text-gray-500">by {doc.uploaded_by}</div>
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
                          View Document
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        {doc.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleDocAction(doc, "approve")}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDocAction(doc, "restrict")}>
                          {doc.access_level === "restricted" ? (
                            <>
                              <Unlock className="w-4 h-4 mr-2" />
                              Unrestrict
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Restrict Access
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDocAction(doc, "delete")}>
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

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a new document to the organization library.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to browse</p>
              <p className="text-sm text-gray-500">Supports PDF, DOC, XLS, PPT, ZIP and more</p>
              <Button variant="outline" className="mt-4 bg-transparent">
                Choose Files
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doc-name">Document Name</Label>
                <Input
                  id="doc-name"
                  placeholder="Enter document name"
                  className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-team">Team</Label>
                <select className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]">
                  <option value="">Select team</option>
                  {uniqueTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-description">Description</Label>
              <Textarea
                id="doc-description"
                placeholder="Describe the document content and purpose"
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doc-access">Access Level</Label>
                <select className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]">
                  <option value="team">Team Only</option>
                  <option value="organization">Organization Wide</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-tags">Tags</Label>
                <Input
                  id="doc-tags"
                  placeholder="Enter tags separated by commas"
                  className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sensitive" />
              <Label htmlFor="sensitive" className="text-sm">
                Mark as sensitive document
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="btn-primary">Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approve Document"}
              {actionType === "restrict" && "Restrict Document Access"}
              {actionType === "delete" && "Delete Document"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" && `Approve "${selectedDoc?.name}" for organization use?`}
              {actionType === "restrict" && `Restrict access to "${selectedDoc?.name}"?`}
              {actionType === "delete" && `Permanently delete "${selectedDoc?.name}"? This action cannot be undone.`}
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
                  : actionType === "restrict"
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "btn-primary"
              }
            >
              {actionType === "approve" && "Approve Document"}
              {actionType === "restrict" && "Restrict Access"}
              {actionType === "delete" && "Delete Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  )
}
