"use client"

import type * as React from "react"
import { useState } from "react"
import { Brain, Upload, MessageSquare, FileText, X } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChatInterface } from "@/components/chat/chat-interface"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { GPT } from "@/types"

// Define navigation items for the admin dashboard
const navigationItems = [
  {
    name: "Team Dashboard",
    href: "/dashboard/admin",
    icon: Brain, // Placeholder icon, replace with actual if needed
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
    icon: Brain, // Placeholder icon
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
    icon: Brain, // Placeholder icon
    description: "Team prompt library",
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Brain, // Placeholder icon
    description: "Team configuration",
  },
]

export default function CreateAdminGPTPage() {
  const [gptName, setGptName] = useState("")
  const [gptDescription, setGptDescription] = useState("")
  const [gptInstructions, setGptInstructions] = useState("")
  const [webAccess, setWebAccess] = useState(false)
  const [teamOnly, setTeamOnly] = useState(true)
  const [selectedModel, setSelectedModel] = useState("GPT-4")
  const [knowledgeFiles, setKnowledgeFiles] = useState<File[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setKnowledgeFiles((prev) => [...prev, ...Array.from(event.target.files)])
    }
  }

  const handleRemoveFile = (index: number) => {
    setKnowledgeFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreateGPT = async () => {
    setIsCreating(true)
    try {
      const newGPT: Partial<GPT> = {
        name: gptName,
        description: gptDescription,
        // For simplicity, instructions are not directly in GPT type, but would be in a real backend
        // instructions: gptInstructions,
        web_access: webAccess,
        team_name: "Your Team", // Placeholder, would be dynamic in a real app
        team_id: "team-admin", // Placeholder
        created_by: "admin-user", // Placeholder
        model: selectedModel,
        access_level: teamOnly ? "team" : "organization",
        status: "active", // Default status for newly created GPTs
      }

      const response = await fetch("/api/gpts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGPT),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const createdGPT = await response.json()
      toast({
        title: "GPT Created Successfully!",
        description: `${createdGPT.name} has been added to your team's GPTs.`,
      })
      router.push("/dashboard/admin/gpts") // Redirect to GPTs list
    } catch (error: any) {
      console.error("Failed to create GPT:", error)
      toast({
        title: "Error creating GPT",
        description: error.message || "Failed to create GPT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Create New Team GPT"
      description="Design and test a new AI assistant for your team."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Panel: Chat Interface for Testing */}
        <div className="flex flex-col h-full">
          <ChatInterface
            gptName={gptName || "New GPT (Testing)"}
            gptDescription={gptDescription || "Test your GPT's behavior here."}
            initialMessages={[]}
          />
        </div>

        {/* Right Panel: Configuration */}
        <Card className="flex flex-col h-full border-[#E0E0E0] shadow-none">
          <CardHeader className="border-b border-[#E0E0E0] p-4">
            <CardTitle className="text-xl text-[#2C2C2C]">GPT Configuration</CardTitle>
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
                  <Label htmlFor="team-only" className="text-base font-medium">
                    Team Only
                  </Label>
                  <p className="text-sm text-gray-500">Restrict access to your team members only</p>
                </div>
                <Switch id="team-only" checked={teamOnly} onCheckedChange={setTeamOnly} />
              </div>
            </div>
          </CardContent>
          <div className="border-t border-[#E0E0E0] p-4 flex justify-end">
            <Button
              onClick={handleCreateGPT}
              disabled={isCreating || !gptName || !gptDescription}
              className="btn-primary"
            >
              {isCreating ? "Creating GPT..." : "Create GPT"}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
