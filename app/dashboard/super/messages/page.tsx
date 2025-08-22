"use client"

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ConversationsList } from '@/components/chat/conversations-list'
import { UserChatInterface } from '@/components/chat/user-chat-interface'
import { EmptyState } from '@/components/chat/empty-state'
import { useAuth } from '@/hooks/use-auth'
import { 
  mockUserConversations, 
  mockUserPresence, 
  mockTeamMembers,
  UserPresenceStatus 
} from '@/lib/chatMockData'
import {
  BarChart3,
  Brain,
  Users,
  Building2,
  FileText,
  BookOpen,
  MessageSquare,
  Settings,
  Shield,
} from "lucide-react"

const navigationItems = [
  {
    name: "Overview",
    href: "/dashboard/super",
    icon: BarChart3,
    description: "Org metrics",
  },
  {
    name: "All GPTs",
    href: "/dashboard/super/gpts",
    icon: Brain,
    description: "Org GPTs",
  },
  {
    name: "User Management",
    href: "/dashboard/super/users",
    icon: Users,
    description: "Users",
  },
  {
    name: "Teams & Units",
    href: "/dashboard/super/teams",
    icon: Building2,
    description: "Teams",
  },
  {
    name: "Document Library",
    href: "/dashboard/super/documents",
    icon: FileText,
    description: "Docs",
  },
  {
    name: "Prompt Library",
    href: "/dashboard/super/prompts",
    icon: BookOpen,
    description: "Prompts",
  },
  {
    name: "Messages",
    href: "/dashboard/super/messages",
    icon: MessageSquare,
    description: "All conversations",
  },
  {
    name: "System Settings",
    href: "/dashboard/super/settings",
    icon: Settings,
    description: "Settings",
  },
  {
    name: "Security",
    href: "/dashboard/super/security",
    icon: Shield,
    description: "Security",
  },
]

export default function SuperAdminMessagesPage() {
  const { user } = useAuth()
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState(mockUserConversations)

  if (!user) {
    return null
  }

  // Create user presence map
  const userPresenceMap = mockUserPresence.reduce((acc, presence) => {
    acc[presence.user_id] = presence.status
    return acc
  }, {} as Record<string, UserPresenceStatus>)

  // Mock unread counts
  const unreadCounts = {
    'conv-1': 0,
    'conv-2': 1,
  }

  // Find active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId)
  const otherUser = activeConversation 
    ? (activeConversation.participant_1.id === user.id 
        ? activeConversation.participant_2 
        : activeConversation.participant_1)
    : null

  const handleNewConversation = (otherUserId: string) => {
    // In a real implementation, this would create a new conversation via API
    const otherUserData = mockTeamMembers.find(member => member.id === otherUserId)
    if (!otherUserData) return

    const newConversation = {
      id: `conv-${Date.now()}`,
      participant_1_id: user.id,
      participant_2_id: otherUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
      last_message_id: undefined,
      is_archived: false,
      participant_1: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        avatar_url: user.avatar,
        status: 'active' as const
      },
      participant_2: {
        id: otherUserData.id,
        full_name: otherUserData.full_name,
        email: otherUserData.email,
        avatar_url: otherUserData.avatar_url,
        status: otherUserData.status
      }
    }

    setConversations(prev => [newConversation, ...prev])
    setActiveConversationId(newConversation.id)
  }

  const handleArchiveConversation = (conversationId: string) => {
    console.log('Archive conversation:', conversationId)
    // In a real implementation, this would archive the conversation via API
  }

  const handleDeleteConversation = (conversationId: string) => {
    console.log('Delete conversation:', conversationId)
    // In a real implementation, this would delete the conversation via API
    setConversations(prev => prev.filter(conv => conv.id !== conversationId))
    if (activeConversationId === conversationId) {
      setActiveConversationId(null)
    }
  }

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Organization Messages"
      description="Monitor and participate in organization-wide conversations"
    >
      <div className="flex h-full">
        <ConversationsList
          conversations={conversations}
          currentUserId={user.id}
          activeConversationId={activeConversationId}
          userPresence={userPresenceMap}
          unreadCounts={unreadCounts}
          onConversationSelect={setActiveConversationId}
          onNewConversation={handleNewConversation}
          onArchiveConversation={handleArchiveConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        
        <div className="flex-1">
          {activeConversation && otherUser ? (
            <UserChatInterface
              conversationId={activeConversation.id}
              otherUser={otherUser}
              currentUserId={user.id}
              userPresence={userPresenceMap}
            />
          ) : (
            <EmptyState onNewConversation={() => {
              // Open new chat dialog via the conversations list
              const conversationsList = document.querySelector('[data-new-chat-trigger]') as HTMLButtonElement
              conversationsList?.click()
            }} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}