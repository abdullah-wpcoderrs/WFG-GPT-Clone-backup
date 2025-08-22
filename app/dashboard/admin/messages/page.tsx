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
  MessageSquare,
  FileText,
  BookOpen,
  Settings,
} from "lucide-react"

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
    name: "Messages",
    href: "/dashboard/admin/messages",
    icon: MessageSquare,
    description: "Team conversations",
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

export default function AdminMessagesPage() {
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
    'conv-1': 1,
    'conv-2': 0,
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
      title="Team Messages"
      description="Communicate with your team members and monitor team conversations"
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