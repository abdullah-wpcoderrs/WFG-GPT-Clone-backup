"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MessageBubble } from './message-bubble'
import { TypingIndicator } from './typing-indicator'
import { MessageInput } from './message-input'
import { PresenceIndicator } from './presence-indicator'
import { useRealtimeChat } from '@/hooks/use-realtime-chat'
import { mockUserMessages, UserPresenceStatus } from '@/lib/chatMockData'
import { MoreVertical, Phone, Video, Info } from 'lucide-react'

interface UserChatInterfaceProps {
  conversationId: string
  otherUser: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
  currentUserId: string
  userPresence?: Record<string, UserPresenceStatus>
}

export function UserChatInterface({
  conversationId,
  otherUser,
  currentUserId,
  userPresence = {}
}: UserChatInterfaceProps) {
  const [messages, setMessages] = useState(
    mockUserMessages.filter(msg => msg.conversation_id === conversationId)
  )
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { typingUsers, onlineUsers, updateTypingStatus } = useRealtimeChat(conversationId, currentUserId)
  
  const otherUserStatus = userPresence[otherUser.id] || UserPresenceStatus.OFFLINE
  const isOtherUserOnline = onlineUsers.includes(otherUser.id)
  
  // Mock user names for typing indicator
  const userNames = { [otherUser.id]: otherUser.full_name }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    setIsLoading(true)
    
    // Create new message
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: content.trim(),
      message_type: 'text' as const,
      file_url: null,
      file_name: null,
      file_size: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_edited: false,
      is_deleted: false,
      read_by: [currentUserId],
      metadata: {},
      sender: {
        id: currentUserId,
        full_name: 'You',
        avatar_url: undefined
      }
    }

    // Add message to local state
    setMessages(prev => [...prev, newMessage])

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false)
      
      // Simulate a response from the other user (for demo purposes)
      if (Math.random() > 0.7) {
        setTimeout(() => {
          const responseMessage = {
            id: `msg-${Date.now()}-response`,
            conversation_id: conversationId,
            sender_id: otherUser.id,
            content: "Thanks for your message! I'll get back to you soon.",
            message_type: 'text' as const,
            file_url: null,
            file_name: null,
            file_size: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_edited: false,
            is_deleted: false,
            read_by: [otherUser.id],
            metadata: {},
            sender: {
              id: otherUser.id,
              full_name: otherUser.full_name,
              avatar_url: otherUser.avatar_url
            }
          }
          setMessages(prev => [...prev, responseMessage])
        }, 2000)
      }
    }, 500)
  }, [conversationId, currentUserId, otherUser])

  const handleTyping = useCallback(() => {
    updateTypingStatus(currentUserId, true)
  }, [currentUserId, updateTypingStatus])

  const handleStopTyping = useCallback(() => {
    updateTypingStatus(currentUserId, false)
  }, [currentUserId, updateTypingStatus])

  const handleFileUpload = useCallback((file: File) => {
    console.log('File upload:', file.name)
    // In a real implementation, this would upload the file and send a message
  }, [])

  return (
    <Card className="flex flex-col h-full border-[#E0E0E0] shadow-none">
      {/* Header */}
      <CardHeader className="border-b border-[#E0E0E0] p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C] text-sm font-medium">
                  {otherUser.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <PresenceIndicator status={otherUserStatus} size="sm" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#2C2C2C]">
                {otherUser.full_name}
              </h3>
              <p className="text-sm text-gray-500">
                {isOtherUserOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#66BB6A]">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#66BB6A]">
              <Video className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#66BB6A]">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Info className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Video className="mr-2 h-4 w-4" />
                  Video Call
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-4 min-h-0">
        <ScrollArea className="h-full chat-scroll-area">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C] text-lg">
                    {otherUser.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <p className="text-lg font-medium mb-2">Start a conversation with {otherUser.full_name}</p>
                <p className="text-sm text-gray-400">Send your first message below</p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender_id === currentUserId}
                  currentUserId={currentUserId}
                  showAvatar={true}
                  showTimestamp={true}
                />
              ))
            )}
            
            {/* Typing Indicator */}
            <TypingIndicator 
              typingUsers={typingUsers.filter(id => id !== currentUserId)} 
              userNames={userNames}
            />
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Message Input */}
      <CardFooter className="border-t border-[#E0E0E0] p-4 flex-shrink-0">
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          onFileUpload={handleFileUpload}
          disabled={isLoading}
          placeholder={`Message ${otherUser.full_name}...`}
        />
      </CardFooter>
    </Card>
  )
}