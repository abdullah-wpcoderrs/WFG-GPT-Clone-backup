import { notFound } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { mockGPTs, mockChatSessions, mockChatMessages } from "@/lib/mock-data"
import { Brain, MessageSquare, FileText, FolderOpen, Settings, User } from "lucide-react"

const navigationItems = [
  {
    name: "My Dashboard",
    href: "/dashboard/user",
    icon: User,
    description: "Personal overview",
  },
  {
    name: "Chat with GPTs",
    href: "/dashboard/user/chats",
    icon: MessageSquare,
    description: "AI conversations",
  },
  {
    name: "My Projects",
    href: "/dashboard/user/projects",
    icon: FolderOpen,
    description: "Project workspace",
  },
  {
    name: "My Docs",
    href: "/dashboard/user/documents",
    icon: FileText,
    description: "Document library",
  },
  {
    name: "My Prompts",
    href: "/dashboard/user/prompts",
    icon: Brain,
    description: "Saved prompts",
  },
  {
    name: "Settings",
    href: "/dashboard/user/settings",
    icon: Settings,
    description: "Account settings",
  },
]

export default function UserChatSessionPage({ params }: { params: { sessionId: string } }) {
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
          onSendMessage={(message) => console.log(`User sent: ${message} to ${gpt.name} in session ${sessionId}`)}
          onNewChat={() => console.log(`Starting new chat with ${gpt.name}`)}
        />
      </div>
    </DashboardLayout>
  )
}
