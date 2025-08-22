"use client"

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PresenceIndicator } from './presence-indicator'
import { mockTeamMembers, UserPresenceStatus } from '@/lib/chatMockData'
import { Search, MessageSquare } from 'lucide-react'

interface NewChatDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateConversation: (otherUserId: string) => void
  currentUserId: string
  userPresence?: Record<string, UserPresenceStatus>
}

export function NewChatDialog({
  isOpen,
  onClose,
  onCreateConversation,
  currentUserId,
  userPresence = {}
}: NewChatDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter out current user and search by name/email
  const filteredUsers = useMemo(() => {
    const availableUsers = mockTeamMembers.filter(user => user.id !== currentUserId)
    
    if (!searchQuery.trim()) return availableUsers

    return availableUsers.filter(user =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [currentUserId, searchQuery])

  const handleUserSelect = (userId: string) => {
    onCreateConversation(userId)
    setSearchQuery('')
  }

  const handleClose = () => {
    setSearchQuery('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#66BB6A]" />
            Start New Conversation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              autoFocus
            />
          </div>
          
          <ScrollArea className="h-64">
            {filteredUsers.length > 0 ? (
              <div className="space-y-2">
                {filteredUsers.map((user) => {
                  const status = userPresence[user.id] || UserPresenceStatus.OFFLINE
                  
                  return (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleUserSelect(user.id)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C] text-sm font-medium">
                            {user.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          <PresenceIndicator status={status} size="sm" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.full_name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUserSelect(user.id)
                        }}
                        className="border-[#66BB6A] text-[#66BB6A] hover:bg-[#66BB6A] hover:text-white"
                      >
                        Chat
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Search className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No users found' : 'No team members available'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'All team members are already in your conversations'
                  }
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}