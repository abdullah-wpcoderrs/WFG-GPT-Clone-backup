"use client"

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatTypingIndicator } from '@/lib/chatMockData'

interface TypingIndicatorProps {
  typingUsers: string[]
  userNames?: Record<string, string>
}

export function TypingIndicator({ typingUsers, userNames = {} }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null

  const displayNames = typingUsers.map(userId => userNames[userId] || 'Someone')

  return (
    <div className="flex items-start gap-3 mb-4 animate-in slide-in-from-bottom-2">
      <Avatar className="h-8 w-8 border border-[#E0E0E0]">
        <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
          {displayNames[0]?.[0] || '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-gray-100 border border-[#E0E0E0] rounded-lg rounded-bl-none p-3 max-w-[80%]">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600 mr-2">
            {formatTypingIndicator(displayNames)}
          </span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
          </div>
        </div>
      </div>
    </div>
  )
}