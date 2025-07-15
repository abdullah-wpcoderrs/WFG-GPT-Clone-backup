import { notFound } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { mockGPTs, mockChatSessions, mockChatMessages } from "@/lib/mock-data"
import { BarChart3, Brain, Users, Building2, FileText, BookOpen, MessageSquare, Settings, Shield } from "lucide-react"

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
    name: "Teams",
    href: "/dashboard/super/teams",
    icon: Building2,
    description: "Team structure",
  },
  {
    name: "Doc Library",
    href: "/dashboard/super/documents",
    icon: FileText,
    description: "Global docs",
  },
  {
    name: "Prompt Library",
    href: "/dashboard/super/prompts",
    icon: BookOpen,
    description: "Org prompt templates",
  },
  {
    name: "Chat History",
    href: "/dashboard/super/chats",
    icon: MessageSquare,
    description: "All conversations",
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

export default function SuperAdminChatSessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params
  const chatSession = mockChatSessions.find((session) => session.id === sessionId)

  if (!chatSession) {
    notFound()
  }

  const gpt = mockGPTs.find((g) => g.id === chatSession.gpt_id)

  if (!gpt) {
    notFound()
  }

  // Get all messages for this chat session
  const sessionMessages = mockChatMessages.filter((msg) => msg.session_id === sessionId)

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title={chatSession.title}
      description={`Continue conversation with ${gpt.name}`}
    >
      <div className="h-[calc(100vh-160px)]">
        <ChatInterface
          gptName={gpt.name}
          gptDescription={gpt.description}
          initialMessages={sessionMessages}
          sessionId={sessionId}
          onSendMessage={(message) =>
            console.log(`Super Admin sent: ${message} to ${gpt.name} in session ${sessionId}`)
          }
          onNewChat={() => console.log(`Starting new chat with ${gpt.name}`)}
        />
      </div>
    </DashboardLayout>
  )
}
