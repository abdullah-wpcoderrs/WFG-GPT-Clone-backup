import { notFound } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { mockGPTs, mockChatSessions, mockChatMessages } from "@/lib/mock-data"
import { Brain, Users, Building2, FileText, BookOpen, BarChart3, Settings, Shield, MessageSquare } from "lucide-react"

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
    name: "My Chats", // New navigation item for personal chat history
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

export default function SuperAdminChatPage({ params }: { params: { gptId: string } }) {
  const { gptId } = params
  const gpt = mockGPTs.find((g) => g.id === gptId)

  if (!gpt) {
    notFound()
  }

  // Filter mock chat sessions and messages for this GPT and a specific super admin (e.g., superadmin-1)
  const superAdminChatSessions = mockChatSessions.filter(
    (session) => session.gpt_id === gptId && session.user_id === "superadmin-1",
  )
  const latestSession = superAdminChatSessions.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  )[0]

  const initialMessages = latestSession ? mockChatMessages.filter((msg) => msg.session_id === latestSession.id) : []

  return (
    <DashboardLayout navigationItems={navigationItems} title={`Chat with ${gpt.name}`} description={gpt.description}>
      <div className="h-[calc(100vh-160px)]">
        <ChatInterface
          gptName={gpt.name}
          gptDescription={gpt.description}
          initialMessages={initialMessages}
          onSendMessage={(message) => console.log(`Super Admin sent: ${message} to ${gpt.name}`)}
          onNewChat={() => console.log(`Super Admin starting new chat with ${gpt.name}`)}
        />
      </div>
    </DashboardLayout>
  )
}
