import { notFound } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { mockGPTs, mockChatSessions, mockChatMessages } from "@/lib/mock-data"
import { Brain, Users, MessageSquare, FileText, BookOpen, BarChart3, Settings } from "lucide-react"

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
    name: "My Chats", // New navigation item for personal chat history
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
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    description: "Team configuration",
  },
]

export default function AdminChatPage({ params }: { params: { gptId: string } }) {
  const { gptId } = params
  const gpt = mockGPTs.find((g) => g.id === gptId)

  if (!gpt) {
    notFound()
  }

  // Filter mock chat sessions and messages for this GPT and a specific admin (e.g., admin-1)
  const adminChatSessions = mockChatSessions.filter(
    (session) => session.gpt_id === gptId && session.user_id === "admin-1",
  )
  const latestSession = adminChatSessions.sort(
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
          onSendMessage={(message) => console.log(`Admin sent: ${message} to ${gpt.name}`)}
          onNewChat={() => console.log(`Admin starting new chat with ${gpt.name}`)}
        />
      </div>
    </DashboardLayout>
  )
}
