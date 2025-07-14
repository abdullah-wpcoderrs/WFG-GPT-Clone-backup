"use client"

import * as React from "react"
import { useChat } from "ai/react"
import { Brain, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { ChatMessage as ChatMessageType } from "@/types"

interface ChatInterfaceProps {
  gptName: string
  gptDescription: string
  initialMessages?: ChatMessageType[]
  onSendMessage?: (message: string) => void
  onNewChat?: () => void
}

export function ChatInterface({
  gptName,
  gptDescription,
  initialMessages = [],
  onSendMessage,
  onNewChat,
}: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    initialMessages: initialMessages.map((msg) => ({
      id: msg.id,
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    })),
    api: "/api/chat", // This will be a mock API route
  })

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSendMessage?.(input) // Callback for parent component
    handleSubmit(e)
  }

  return (
    <Card className="flex flex-col h-full border-[#E0E0E0] shadow-none">
      <CardHeader className="border-b border-[#E0E0E0] p-4">
        <CardTitle className="text-xl text-[#2C2C2C] flex items-center">
          <Brain className="h-5 w-5 mr-2 text-[#66BB6A]" />
          {gptName}
        </CardTitle>
        <p className="text-sm text-gray-600">{gptDescription}</p>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Start a conversation with {gptName}!</p>
                {onNewChat && (
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={onNewChat}>
                    New Chat
                  </Button>
                )}
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex items-start gap-3", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" && (
                  <Avatar className="h-8 w-8 border border-[#E0E0E0]">
                    <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C]">
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] p-3 rounded-lg",
                    m.role === "user"
                      ? "bg-[#66BB6A] text-white rounded-br-none"
                      : "bg-gray-100 text-[#2C2C2C] rounded-bl-none border border-[#E0E0E0]",
                  )}
                >
                  <p className="text-sm">{m.content}</p>
                </div>
                {m.role === "user" && (
                  <Avatar className="h-8 w-8 border border-[#E0E0E0]">
                    <AvatarFallback className="bg-gray-200 text-gray-700">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t border-[#E0E0E0] p-4">
        <form onSubmit={handleFormSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="flex-1 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
