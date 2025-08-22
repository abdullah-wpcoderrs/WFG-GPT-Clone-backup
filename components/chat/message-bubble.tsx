"use client"

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/chatMockData'
import { Check, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    created_at: string
    sender_id: string
    read_by?: string[]
    sender: {
      id: string
      full_name: string
      avatar_url?: string
    }
  }
  isOwn: boolean
  currentUserId: string
  showAvatar?: boolean
  showTimestamp?: boolean
}

export function MessageBubble({ 
  message, 
  isOwn, 
  currentUserId,
  showAvatar = true, 
  showTimestamp = true 
}: MessageBubbleProps) {
  const isRead = message.read_by?.length && message.read_by.length > 1
  const isDelivered = message.read_by?.includes(currentUserId)

  const getMessageStatus = () => {
    if (isRead) return { icon: CheckCheck, color: 'text-green-500', label: 'Read' }
    if (isDelivered) return { icon: Check, color: 'text-blue-500', label: 'Delivered' }
    return { icon: Check, color: 'text-gray-400', label: 'Sent' }
  }

  const status = getMessageStatus()
  const StatusIcon = status.icon

  return (
    <div
      className={cn(
        "flex items-start gap-3 chat-message",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8 border border-[#E0E0E0]">
          <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C] text-xs">
            {message.sender.full_name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex flex-col max-w-[80%]">
        <div
          className={cn(
            "text-[#2C2C2C] rounded-lg border p-3",
            isOwn
              ? "bg-[#66BB6A] text-white border-[#66BB6A] rounded-br-none"
              : "bg-gray-100 border-[#E0E0E0] rounded-bl-none"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        <div className={cn(
          "flex items-center gap-2 mt-1 text-xs text-gray-500",
          isOwn ? "justify-end" : "justify-start"
        )}>
          {showTimestamp && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default">
                    {formatRelativeTime(new Date(message.created_at))}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{new Date(message.created_at).toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {isOwn && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <StatusIcon className={cn("w-3 h-3", status.color)} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{status.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      {isOwn && showAvatar && (
        <Avatar className="h-8 w-8 border border-[#E0E0E0]">
          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
            You
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}