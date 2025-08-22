"use client"

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ConversationItem } from './conversation-item'
import { NewChatDialog } from './new-chat-dialog'
import { UserPresenceStatus } from '@/lib/chatMockData'
import { Search, Plus, MessageSquare } from 'lucide-react'

interface ConversationsListProps {
  conversations: Array<{
    id: string
    participant_1: { id: string; full_name: string; avatar_url?: string }
    participant_2: { id: string; full_name: string; avatar_url?: string }
    last_message?: {
      content: string
      created_at: string
      sender_id: string
    }
    updated_at: string
  }>
  currentUserId: string
  activeConversationId?: string
  userPresence?: Record<string, UserPresenceStatus>
  unreadCounts?: Record<string, number>
  onConversationSelect: (conversationId: string) => void
  onNewConversation?: (otherUserId: string) => void
  onArchiveConversation?: (conversationId: string) => void
  onDeleteConversation?: (conversationId: string) => void
}

export function ConversationsList({
  conversations,
  currentUserId,
  activeConversationId,
  userPresence = {},
  unreadCounts = {},
  onConversationSelect,
  onNewConversation,
  onArchiveConversation,
  onDeleteConversation
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations

    return conversations.filter(conversation => {
      const otherParticipant = conversation.participant_1.id === currentUserId 
        ? conversation.participant_2 
        : conversation.participant_1
      
      return otherParticipant.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             conversation.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [conversations, currentUserId, searchQuery])

  const handleNewConversation = (otherUserId: string) => {
    onNewConversation?.(otherUserId)
    setIsNewChatOpen(false)
  }

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <Button
            size="sm"
            onClick={() => setIsNewChatOpen(true)}
            className="bg-[#66BB6A] hover:bg-[#66BB6A]/90"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 focus:border-[#66BB6A] focus:ring-[#66BB6A]"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                currentUserId={currentUserId}
                isActive={activeConversationId === conversation.id}
                unreadCount={unreadCounts[conversation.id] || 0}
                userPresence={userPresence}
                onClick={() => onConversationSelect(conversation.id)}
                onArchive={onArchiveConversation ? () => onArchiveConversation(conversation.id) : undefined}
                onDelete={onDeleteConversation ? () => onDeleteConversation(conversation.id) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start a conversation with a team member'
              }
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsNewChatOpen(true)}
                className="bg-[#66BB6A] hover:bg-[#66BB6A]/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            )}
          </div>
        )}
      </ScrollArea>

      {/* New Chat Dialog */}
      <NewChatDialog
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onCreateConversation={handleNewConversation}
        currentUserId={currentUserId}
      />
    </div>
  )
}