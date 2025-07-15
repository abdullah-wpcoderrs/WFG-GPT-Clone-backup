import { notFound } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { mockGPTs, mockChatSessions, mockChatMessages } from "@/lib/mock-data"
import { Brain, MessageSquare, Users, FileText, LayoutTemplateIcon as Template, Activity, Settings } from "lucide-react"

const navigationItems = [
  {
    name: "Team Overview",
    href: "/dashboard/admin",
    icon: Brain,
    description: "Team metrics & insights",
  },
  {
    name: "GPT Management",
    href: "/dashboard/admin/gpts",
    icon: Brain,
    description: "Create & manage team GPTs",
  },
  {
    name: "Team Members",
    href: "/dashboard/admin/members",
    icon: Users,
    description: "Manage team access",
  },
  {
    name: "Team Docs",
    href: "/dashboard/admin/documents",
    icon: FileText,
    description: "Shared resources",
  },
  {
    name: "Templates",
    href: "/dashboard/admin/templates",
    icon: Template,
    description: "Prompt templates",
  },
  {
    name: "Chat History",
    href: "/dashboard/admin/chats",
    icon: MessageSquare,
    description: "Team conversations",
  },
  {
    name: "Activity Logs",
    href: "/dashboard/admin/logs",
    icon: Activity,
    description: "Usage & audit trail",
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    description: "Team configuration",
  },
]

export default function AdminChatSessionPage({ params }: { params: { sessionId: string } }) {
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
          onSendMessage={(message) => console.log(`Admin sent: ${message} to ${gpt.name} in session ${sessionId}`)}
          onNewChat={() => console.log(`Starting new chat with ${gpt.name}`)}
        />
      </div>
    </DashboardLayout>
  )
}
