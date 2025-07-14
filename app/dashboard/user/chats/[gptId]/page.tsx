import { notFound } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { mockGPTs, mockChatSessions, mockChatMessages } from "@/lib/mock-data"
import { Brain, MessageSquare, FolderOpen, BookOpen, FileText, Settings } from "lucide-react"

const navigationItems = [
  {
    name: "My GPT Tools",
    href: "/dashboard/user",
    icon: Brain,
    description: "Access your assigned GPTs",
  },
  {
    name: "My Chats",
    href: "/dashboard/user/chats",
    icon: MessageSquare,
    description: "Chat history & sessions",
  },
  {
    name: "My Projects",
    href: "/dashboard/user/projects",
    icon: FolderOpen,
    description: "Organized chat folders",
  },
  {
    name: "Prompt Library",
    href: "/dashboard/user/prompts",
    icon: BookOpen,
    description: "Saved prompt templates",
  },
  {
    name: "Team Documents",
    href: "/dashboard/user/documents",
    icon: FileText,
    description: "Shared team resources",
  },
  {
    name: "Settings",
    href: "/dashboard/user/settings",
    icon: Settings,
    description: "Profile & preferences",
  },
]

export default function UserChatPage({ params }: { params: { gptId: string } }) {
  const { gptId } = params
  const gpt = mockGPTs.find((g) => g.id === gptId)

  if (!gpt) {
    notFound()
  }

  // Filter mock chat sessions and messages for this GPT and a specific user (e.g., user-1)
  // In a real app, you'd fetch this based on the logged-in user and gptId
  const userChatSessions = mockChatSessions.filter(
    (session) => session.gpt_id === gptId && session.user_id === "user-1",
  )
  const latestSession = userChatSessions.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  )[0]

  const initialMessages = latestSession ? mockChatMessages.filter((msg) => msg.session_id === latestSession.id) : []

  return (
    <DashboardLayout navigationItems={navigationItems} title={`Chat with ${gpt.name}`} description={gpt.description}>
      <div className="h-[calc(100vh-160px)]">
        {" "}
        {/* Adjust height as needed */}
        <ChatInterface
          gptName={gpt.name}
          gptDescription={gpt.description}
          initialMessages={initialMessages}
          onSendMessage={(message) => console.log(`User sent: ${message} to ${gpt.name}`)}
          onNewChat={() => console.log(`Starting new chat with ${gpt.name}`)}
        />
      </div>
    </DashboardLayout>
  )
}
