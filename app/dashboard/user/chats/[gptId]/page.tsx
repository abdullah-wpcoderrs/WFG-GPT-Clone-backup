"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { mockGPTs } from "@/lib/mock-data"
import { Brain, MessageSquare, FolderOpen, BookOpen, FileText, Settings } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
  const router = useRouter()
  const { toast } = useToast()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [initialMessages, setInitialMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const gpt = mockGPTs.find((g) => g.id === gptId)

  if (!gpt) {
    notFound()
  }

  useEffect(() => {
    const initializeChatSession = async () => {
      try {
        // Check if there's an existing session for this user and GPT
        const response = await fetch(`/api/chat-sessions?gptId=${gptId}&userId=user-1`)
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
              userId: 'user-1',
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
        const mockMessages: any[] = [] // Empty for new sessions
        
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
  }, [gptId])

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
          onSendMessage={(message) => console.log(`User sent: ${message} to ${gpt.name} in session ${sessionId}`)}
          onNewChat={() => {
            console.log(`User starting new chat with ${gpt.name}`)
            // Refresh the page to create a new session
            router.refresh()
          }}
        />
      </div>
    </DashboardLayout>
  )
}
