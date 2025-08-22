"use client"

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PresenceIndicator } from './presence-indicator'
import { formatRelativeTime, UserPresenceStatus } from '@/lib/chatMockData'
import { MoreVertical, Archive, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConversationItemProps {
  conversation: {
    id: string
    participant_1: { id: string; full_name: string; avatar_url?: string }
    participant_2: { id: string; full_name: string; avatar_url?: string }
    last_message?: {
      content: string
      created_at: string
      sender_id: string
    }
    updated_at: string
  }
  currentUserId: string
  isActive?: boolean
  unreadCount?: number
  userPresence?: Record<string, UserPresenceStatus>
  onClick: () => void
  onArchive?: () => void
  onDelete?: () => void
}

export function ConversationItem({
  conversation,
  currentUserId,
  isActive = false,
  unreadCount = 0,
  userPresence = {},
  onClick,
  onArchive,
  onDelete
}: ConversationItemProps) {
  // Determine the other participant
  const otherParticipant = conversation.participant_1.id === currentUserId 
    ? conversation.participant_2 
    : conversation.participant_1

  const otherParticipantStatus = userPresence[otherParticipant.id] || UserPresenceStatus.OFFLINE

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message
  }

  const isLastMessageFromOther = conversation.last_message?.sender_id !== currentUserId

  return (
    <div
      className={cn(
        "conversation-item flex items-center space-x-3 p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors",
        isActive && "bg-[#E8F5E8] border-l-4 border-l-[#66BB6A]"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C] text-sm font-medium">
            {otherParticipant.full_name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1">
          <PresenceIndicator status={otherParticipantStatus} size="sm" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "text-sm font-medium truncate",
            unreadCount > 0 ? "font-semibold" : "font-medium"
          )}>
            {otherParticipant.full_name}
          </h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Badge className="bg-[#66BB6A] text-white text-xs px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
            <span className="text-xs text-gray-500">
              {formatRelativeTime(new Date(conversation.updated_at))}
            </span>
          </div>
        </div>
        
        {conversation.last_message && (
          <div className="flex items-center mt-1">
            <p className={cn(
              "text-sm text-gray-600 truncate",
              unreadCount > 0 && isLastMessageFromOther ? "font-medium text-gray-800" : ""
            )}>
              {isLastMessageFromOther ? '' : 'You: '}
              {truncateMessage(conversation.last_message.content)}
            </p>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onArchive && (
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive() }}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}