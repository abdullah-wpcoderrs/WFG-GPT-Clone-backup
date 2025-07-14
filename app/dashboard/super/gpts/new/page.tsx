"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Brain, Users, Building2, FileText, BookOpen, BarChart3, Settings, Shield, MessageSquare } from "lucide-react"
import { mockGPTs, mockUsers } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

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
    name: "My Chats",
    href: "/dashboard/super/chats",
    icon: MessageSquare,
    description: "My personal chat history",
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

export default function CreateGPTPage() {
  const router = useRouter()
  const [gptName, setGptName] = useState("")
  const [gptDescription, setGptDescription] = useState("")
  const [gptInstructions, setGptInstructions] = useState("")
  const [accessLevel, setAccessLevel] = useState<"team" | "organization">("team")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles(Array.from(event.target.files))
    }
  }

  const handleCreateGPT = async () => {
    setIsCreating(true)
    // Simulate API call to create GPT
    console.log("Creating GPT:", {
      gptName,
      gptDescription,
      gptInstructions,
      accessLevel,
      selectedTeam,
      uploadedFiles: uploadedFiles.map((f) => f.name),
    })

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Add new GPT to mock data (for demonstration)
    const newGptId = `gpt-${mockGPTs.length + 1}`
    mockGPTs.push({
      id: newGptId,
      name: gptName,
      description: gptDescription,
      team_name:
        accessLevel === "organization"
          ? "Organization-wide"
          : mockUsers.find((u) => u.team_id === selectedTeam)?.team_name || "Unknown Team",
      last_used: "Just now",
      usage_count: 0,
      status: "active",
      created_by: "Super Admin", // Assuming superadmin-1 is creating
      web_access: true, // Default for new GPTs
      approval_status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      active_users: 0,
      model: "GPT-4", // Default model
      monthly_cost: 0,
      compliance_score: 100,
      risk_level: "low",
      access_level: accessLevel,
    })

    setIsCreating(false)
    router.push("/dashboard/super/gpts") // Redirect to all GPTs page
  }

  const uniqueTeams = Array.from(new Set(mockUsers.map((user) => ({ id: user.team_id, name: user.team_name })))).filter(
    (team) => team.id !== "org",
  ) // Exclude 'org' as it's for organization-wide access

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Create New Custom GPT"
      description="Configure and train a new AI assistant for your organization."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)]">
        {/* Left Half: GPT Testing Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            gptName={gptName || "New GPT (Test Mode)"}
            gptDescription={gptDescription || "Start typing to test your GPT's responses."}
            initialMessages={[]}
            onSendMessage={(message) => console.log(`Test message: ${message}`)}
          />
        </div>

        {/* Right Half: GPT Configuration Form */}
        <Card className="w-full lg:w-1/2 border-[#E0E0E0] shadow-none overflow-auto">
          <CardHeader>
            <CardTitle className="text-xl text-[#2C2C2C]">GPT Configuration</CardTitle>
            <CardDescription>Define your GPT's purpose, instructions, and training data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="gpt-name">GPT Name</Label>
              <Input
                id="gpt-name"
                placeholder="e.g., Legal Document Reviewer"
                value={gptName}
                onChange={(e) => setGptName(e.target.value)}
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpt-description">Description</Label>
              <Textarea
                id="gpt-description"
                placeholder="A brief overview of what this GPT does."
                value={gptDescription}
                onChange={(e) => setGptDescription(e.target.value)}
                className="min-h-[80px] border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpt-instructions">Instructions (System Prompt)</Label>
              <Textarea
                id="gpt-instructions"
                placeholder="Provide detailed instructions for the AI agent. What should it do? What should it avoid?"
                value={gptInstructions}
                onChange={(e) => setGptInstructions(e.target.value)}
                className="min-h-[150px] border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="access-level">Access Level</Label>
              <Select value={accessLevel} onValueChange={(value: "team" | "organization") => setAccessLevel(value)}>
                <SelectTrigger className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team Specific</SelectItem>
                  <SelectItem value="organization">Organization-wide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {accessLevel === "team" && (
              <div className="space-y-2">
                <Label htmlFor="select-team">Assign to Team</Label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="training-docs">Upload Training Documents</Label>
              <Input
                id="training-docs"
                type="file"
                multiple
                onChange={handleFileChange}
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A] file:text-[#2C2C2C] file:bg-gray-100 file:border-0 file:mr-2"
              />
              {uploadedFiles.length > 0 && (
                <div className="text-sm text-gray-600">
                  {uploadedFiles.length} file(s) selected: {uploadedFiles.map((f) => f.name).join(", ")}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Upload documents (PDF, DOCX, TXT) to provide context for your GPT.
              </p>
            </div>

            <Button
              onClick={handleCreateGPT}
              className="w-full btn-primary"
              disabled={
                isCreating ||
                !gptName ||
                !gptDescription ||
                !gptInstructions ||
                (accessLevel === "team" && !selectedTeam)
              }
            >
              {isCreating ? "Creating GPT..." : "Create GPT"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
