"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Brain,
  Upload,
  FileText,
  X,
  ArrowLeft,
  Users,
  MessageSquare,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  Building2,
  Trash2,
  Save,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ChatInterface } from "@/components/chat/chat-interface"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { GPT } from "@/types"
import SuperAdminEditGPTLoading from "@/components/super-admin-edit-gpt-loading"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Define navigation items for the super admin dashboard - CONSISTENT WITH OTHER PAGES
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
    name: "Chat History",
    href: "/dashboard/super/chats",
    icon: MessageSquare,
    description: "All chat conversations",
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

interface EditSuperAdminGPTPageProps {
  params: {
    id: string
  }
}

export default function EditSuperAdminGPTPage({ params }: EditSuperAdminGPTPageProps) {
  const [gpt, setGpt] = useState<GPT | null>(null)
  const [gptName, setGptName] = useState("")
  const [gptDescription, setGptDescription] = useState("")
  const [gptInstructions, setGptInstructions] = useState("")
  const [webAccess, setWebAccess] = useState(false)
  const [accessLevel, setAccessLevel] = useState<"team" | "organization">("team")
  const [selectedModel, setSelectedModel] = useState("GPT-4")
  const [knowledgeFiles, setKnowledgeFiles] = useState<File[]>([])
  const [status, setStatus] = useState<"active" | "inactive" | "pending">("pending")
  const [approvalRequired, setApprovalRequired] = useState(false)
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchGPT = async () => {
      try {
        const response = await fetch(`/api/gpts/${params.id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const gptData = await response.json()
        setGpt(gptData)

        // Pre-fill form fields
        setGptName(gptData.name || "")
        setGptDescription(gptData.description || "")
        setGptInstructions(gptData.instructions || "")
        setWebAccess(gptData.web_access || false)
        setAccessLevel(gptData.access_level || "team")
        setSelectedModel(gptData.model || "GPT-4")
        setStatus(gptData.status || "pending")
        setApprovalRequired(gptData.approval_required || false)
        setRiskLevel(gptData.risk_level || "low")
      } catch (error: any) {
        console.error("Failed to fetch GPT:", error)
        toast.error("Failed to load GPT data")
        router.push("/dashboard/super/gpts")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGPT()
  }, [params.id, router])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setKnowledgeFiles((prev) => [...prev, ...Array.from(event.target.files)])
    }
  }

  const handleRemoveFile = (index: number) => {
    setKnowledgeFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveGPT = async () => {
    setIsSaving(true)
    try {
      const updatedGPT: Partial<GPT> = {
        name: gptName,
        description: gptDescription,
        instructions: gptInstructions,
        web_access: webAccess,
        access_level: accessLevel,
        model: selectedModel,
        status: status,
        approval_required: approvalRequired,
        risk_level: riskLevel,
      }

      const response = await fetch(`/api/gpts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedGPT),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const savedGPT = await response.json()
      toast.success(`${savedGPT.name} has been updated successfully!`)
      router.push("/dashboard/super/gpts")
    } catch (error: any) {
      console.error("Failed to update GPT:", error)
      toast.error("Failed to update GPT. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteGPT = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/gpts/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast.success(`${gpt?.name || "The GPT"} has been deleted successfully!`)
      router.push("/dashboard/super/gpts")
    } catch (error: any) {
      console.error("Failed to delete GPT:", error)
      toast.error("Failed to delete GPT. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <SuperAdminEditGPTLoading />
  }

  if (!gpt) {
    return <div>GPT not found</div>
  }

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Edit Organization GPT"
      description="Modify an organization-wide AI assistant."
    >
      <div className="mb-4 flex justify-between items-center">
        <Link href="/dashboard/super/gpts">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to GPTs
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mb-4">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete GPT
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the GPT and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteGPT} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Panel: Chat Interface for Testing */}
        <div className="flex flex-col h-full">
          <ChatInterface
            gptName={gptName || "GPT (Testing)"}
            gptDescription={gptDescription || "Test your GPT's behavior here."}
            initialMessages={[]}
          />
        </div>

        {/* Right Panel: Configuration */}
        <Card className="flex flex-col h-full border-[#E0E0E0] shadow-none">
          <CardHeader className="border-b border-[#E0E0E0] p-4">
            <CardTitle className="text-xl text-[#2C2C2C] flex items-center gap-2">
              GPT Configuration
              {gpt && (
                <Badge
                  variant={gpt.status === "active" ? "default" : gpt.status === "pending" ? "secondary" : "destructive"}
                >
                  {gpt.status}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6 overflow-y-auto space-y-6">
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

            <Separator />

            <div className="space-y-2">
              <Label>Knowledge Base (Training Data)</Label>
              <div className="border border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center h-full w-full cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Drag & drop files here, or <span className="font-medium text-[#66BB6A]">browse</span>
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOCX, TXT, CSV (Max 10MB per file)</p>
                </label>
              </div>
              {knowledgeFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {knowledgeFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)} className="h-6 w-6 p-0">
                        <X className="w-4 h-4 text-gray-500" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

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
                  <Label htmlFor="access-level" className="text-base font-medium">
                    Access Level
                  </Label>
                  <p className="text-sm text-gray-500">Who can use this GPT?</p>
                </div>
                <select
                  id="access-level"
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as "team" | "organization")}
                  className="w-auto px-3 py-2 border border-[#E0E0E0] rounded-md focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                >
                  <option value="team">Team Only</option>
                  <option value="organization">Organization Wide</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="status" className="text-base font-medium">
                    Status
                  </Label>
                  <p className="text-sm text-gray-500">Current operational status of the GPT</p>
                </div>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "inactive" | "pending")}
                  className="w-auto px-3 py-2 border border-[#E0E0E0] rounded-md focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="approval-required" className="text-base font-medium">
                    Approval Required
                  </Label>
                  <p className="text-sm text-gray-500">Requires admin approval before deployment</p>
                </div>
                <Switch id="approval-required" checked={approvalRequired} onCheckedChange={setApprovalRequired} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="risk-level" className="text-base font-medium">
                    Risk Level
                  </Label>
                  <p className="text-sm text-gray-500">Assessed risk associated with this GPT's usage</p>
                </div>
                <select
                  id="risk-level"
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as "low" | "medium" | "high")}
                  className="w-auto px-3 py-2 border border-[#E0E0E0] rounded-md focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </CardContent>
          <div className="border-t border-[#E0E0E0] p-4 flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/super/gpts")} className="border-[#E0E0E0]">
              Cancel
            </Button>
            <Button onClick={handleSaveGPT} disabled={isSaving || !gptName || !gptDescription} className="btn-primary">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
