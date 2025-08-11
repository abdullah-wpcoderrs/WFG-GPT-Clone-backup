"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { mockGPTs } from "@/lib/mock-data"
import { Brain, Users, MessageSquare, FileText, BookOpen, BarChart3, Settings } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ChatMessage } from "@/types"

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
    description: "Team & account settings",
  },
]

export default function AdminChatPage({ params }: { params: { gptId: string } }) {
  const { gptId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const gpt = mockGPTs.find((g) => g.id === gptId)

  if (!gpt) {
    notFound()
  }

  useEffect(() => {
    const initializeChatSession = async () => {
      try {
        // Check if there's an existing session for this user and GPT
        const response = await fetch(`/api/chat-sessions?gptId=${gptId}&userId=admin-1`)
        const { sessionId: existingSessionId } = await response.json()
        
        let sessionIdToUse = existingSessionId
        
        // If no existing session, create a new one
        if (!sessionIdToUse) {
          const createResponse = await fetch('/api/chat-sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gptId,
              userId: 'admin-1',
            }),
          })
          
          if (!createResponse.ok) {
            throw new Error('Failed to create chat session')
          }
          
          const { sessionId: newSessionId } = await createResponse.json()
          sessionIdToUse = newSessionId
        }
        
        // Fetch initial messages for the session
        // In a real app, you would fetch from your database
        // For now, we'll use mock data
        const mockMessages: ChatMessage[] = [] // Empty for new sessions
        
        setSessionId(sessionIdToUse)
        setInitialMessages(mockMessages)
      } catch (error) {
        console.error('Error initializing chat session:', error)
        toast({
          title: "Error",
          description: "Failed to initialize chat session",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializeChatSession()
  }, [gptId, toast])

  if (isLoading) {
    return (
      <DashboardLayout navigationItems={navigationItems} title={`Chat with ${gpt.name}`} description={gpt.description}>
        <div className="h-[calc(100vh-160px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#66BB6A] mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing chat session...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navigationItems={navigationItems} title={`Chat with ${gpt.name}`} description={gpt.description}>
      <div className="h-[calc(100vh-160px)]">
        <ChatInterface
          gptName={gpt.name}
          gptDescription={gpt.description}
          initialMessages={initialMessages}
          sessionId={sessionId || undefined}
          onSendMessage={(message) => console.log(`Admin sent: ${message} to ${gpt.name} in session ${sessionId}`)}
          onNewChat={() => {
            console.log(`Admin starting new chat with ${gpt.name}`)
            // Refresh the page to create a new session
            router.refresh()
          }}
        />
      </div>
    </DashboardLayout>
  )
}
