"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Plus } from 'lucide-react'

interface EmptyStateProps {
  onNewConversation?: () => void
}

export function EmptyState({ onNewConversation }: EmptyStateProps) {
  return (
    <Card className="flex-1 border-none shadow-none">
      <CardContent className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <MessageSquare className="w-12 h-12 text-gray-400" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to Messages
        </h2>
        
        <p className="text-gray-500 mb-6 max-w-md">
          Select a conversation from the sidebar to start chatting, or create a new conversation with a team member.
        </p>
        
        {onNewConversation && (
          <Button
            onClick={onNewConversation}
            className="bg-[#66BB6A] hover:bg-[#66BB6A]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Start New Conversation
          </Button>
        )}
      </CardContent>
    </Card>
  )
}