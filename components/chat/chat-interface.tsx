"use client"

import * as React from "react"
import { useChat } from "ai/react"
import { Send, Paperclip, FileText, Brain, Download, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { ChatMessage as ChatMessageType, DocumentReport } from "@/types"
import { isDocumentRequest, suggestDocumentGeneration } from "@/lib/document-request-detector"
import { generateMockReport, saveGeneratedReport } from "@/lib/mock-report-generator"
import { saveToMemory } from "@/lib/chat-memory"
import { createDocumentContext, type DocumentContext } from "@/lib/document-parser"
import { saveSessionContext, injectContext } from "@/lib/context-manager"

interface ChatInterfaceProps {
  gptName: string
  gptDescription: string
  initialMessages?: ChatMessageType[]
  sessionId?: string
  onSendMessage?: (message: string) => void
  onNewChat?: () => void
}

export function ChatInterface({
  gptName,
  gptDescription,
  initialMessages = [],
  sessionId,
  onSendMessage,
  onNewChat,
}: ChatInterfaceProps) {
  const { messages, input, handleInputChange: originalHandleInputChange, handleSubmit, isLoading, append } = useChat({
    initialMessages: initialMessages.map((msg) => ({
      id: msg.id,
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    })),
    api: "/api/chat",
    body: {
      sessionId: sessionId,
      gptName: gptName,
    },
  })

  const [documentSuggestion, setDocumentSuggestion] = React.useState<string | null>(null)
  const [documentReports, setDocumentReports] = React.useState<DocumentReport[]>([])
  const [isGeneratingDocument, setIsGeneratingDocument] = React.useState(false)
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])
  const [messageAttachments, setMessageAttachments] = React.useState<Record<string, any[]>>({})
  const [pendingAttachments, setPendingAttachments] = React.useState<any[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setUploadedFiles(prev => [...prev, ...files])
      
      // Reset the input value to allow uploading the same file again
      e.target.value = ''
    }
  }

  // Parse uploaded documents and create context
  const parseDocuments = async () => {
    if (uploadedFiles.length === 0) return []
    
    try {
      const documentContexts = await Promise.all(
        uploadedFiles.map(file => createDocumentContext(file))
      )
      
      // Save document contexts to session
      if (sessionId) {
        saveSessionContext(sessionId, documentContexts)
      }
      
      // Add a message to the chat about the parsed documents with more detail
      if (documentContexts.length > 0) {
        const documentList = documentContexts.map(ctx => ctx.fileName).join(', ')
        const parseMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant' as const,
          content: `I've parsed the following document(s): ${documentList}. I will use the content of these documents to enhance my responses to your questions. Feel free to ask me questions about the information in these documents!`
        }
        append(parseMessage)
      }
      
      return documentContexts
    } catch (error) {
      console.error('Error parsing documents:', error)
      const errorMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error while parsing your documents. Please try again.'
      }
      append(errorMessage)
      return []
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Store the previous messages count to detect new messages
  const prevMessagesCount = React.useRef(messages.length)

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Save chat messages to memory and handle attachments
  React.useEffect(() => {
    // Check if a new message was added
    if (messages.length > prevMessagesCount.current) {
      const lastMessage = messages[messages.length - 1]
      
      // If the last message is from the user and we have pending attachments
      if (lastMessage.role === 'user' && pendingAttachments.length > 0) {
        // Assign pending attachments to this user message
        setMessageAttachments(prev => ({
          ...prev,
          [lastMessage.id]: pendingAttachments
        }))
        // Clear pending attachments
        setPendingAttachments([])
      }
      
      // Save to memory if we have a user-assistant pair
      if (sessionId) {
        const secondLastMessage = messages[messages.length - 2]
        
        // If the last message is from the assistant and the second last is from the user
        if (lastMessage.role === 'assistant' && 
            secondLastMessage && secondLastMessage.role === 'user') {
          // Save to memory
          saveToMemory(
            sessionId, 
            secondLastMessage.content, 
            lastMessage.content, 
            ['chat']
          )
        }
      }
    }
    
    // Update the previous messages count
    prevMessagesCount.current = messages.length
  }, [messages, sessionId, pendingAttachments])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    originalHandleInputChange(e)
    
    // Check for document request suggestions as user types
    if (value.length > 10) {
      const suggestion = suggestDocumentGeneration(value)
      setDocumentSuggestion(suggestion)
    } else {
      setDocumentSuggestion(null)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Store the user's message for memory
    const userMessage = input
    
    // Create attachment information for the message
    const attachments = uploadedFiles.map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/octet-stream'
    }))
    
    // Parse any uploaded documents
    const documentContexts = await parseDocuments()
    
    // Inject context into the user's message
    const messageWithContext = sessionId ? injectContext(input, sessionId) : input
    
    // Check if this is a document request
    if (isDocumentRequest(input) && sessionId) {
      // Generate document
      setIsGeneratingDocument(true)
      try {
        const documentRequest = {
          id: `req-${Date.now()}`,
          session_id: sessionId,
          prompt: messageWithContext, // Use message with context
          created_at: new Date().toISOString(),
          status: 'pending' as const
        }
        
        const report = await generateMockReport(documentRequest)
        const savedReport = await saveGeneratedReport(report)
        
        setDocumentReports(prev => [...prev, savedReport])
        
        // Add a message to the chat about the generated document
        const documentMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant' as const,
          content: `I've generated a document based on your request. You can download it using the download button.`
        }
        append(documentMessage)
        
        // Save to memory
        if (sessionId) {
          saveToMemory(sessionId, userMessage, documentMessage.content, ['document-request'])
        }
      } catch (error) {
        console.error('Error generating document:', error)
        // Add an error message to the chat
        const errorMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant' as const,
          content: 'Sorry, I encountered an error while generating your document. Please try again.'
        }
        append(errorMessage)
        
        // Save to memory
        if (sessionId) {
          saveToMemory(sessionId, userMessage, errorMessage.content, ['error'])
        }
      } finally {
        setIsGeneratingDocument(false)
      }
    } else {
      // Handle regular chat message with context injection
      onSendMessage?.(messageWithContext) // Callback for parent component with context
      
      // Store pending attachments for the next user message
      if (attachments.length > 0) {
        setPendingAttachments(attachments)
      }
      
      // Create a custom event with context for useChat
      const customEvent = {
        ...e,
        target: {
          ...e.target,
          elements: {
            message: { value: messageWithContext }
          }
        }
      } as unknown as React.FormEvent<HTMLFormElement>
      
      handleSubmit(customEvent)
      
      // We'll save to memory after the response is received
      // This will be handled in the useEffect that watches messages
    }
    
    setDocumentSuggestion(null) // Clear suggestion after sending
    
    // Clear uploaded files after submission
    setUploadedFiles([])
  }

  return (
    <Card className="flex flex-col h-full min-h-0 border-[#E0E0E0] shadow-none">
      <CardHeader className="border-b border-[#E0E0E0] p-4 flex-shrink-0">
        <CardTitle className="text-xl text-[#2C2C2C] flex items-center">
          <Brain className="h-5 w-5 mr-2 text-[#66BB6A]" />
          {gptName}
          {sessionId && <span className="ml-2 text-sm text-gray-500 font-normal">Session: {sessionId.slice(-8)}</span>}
        </CardTitle>
        <p className="text-sm text-gray-600">{gptDescription}</p>
      </CardHeader>
      <CardContent className="flex-1 p-4 min-h-0">
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex items-start gap-3", {
                  "justify-end": message.role === "user",
                  "justify-start": message.role === "assistant",
                })}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 border border-[#E0E0E0]">
                    <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C]">
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn("text-[#2C2C2C] rounded-lg border p-3 max-w-[80%]", {
                    "bg-[#B9E769] border-[#66BB6A]": message.role === "user",
                    "bg-gray-100 border-[#E0E0E0]": message.role === "assistant",
                    "rounded-br-none": message.role === "user",
                    "rounded-bl-none": message.role === "assistant",
                  })}
                >
                  {message.content}
                  {/* Display attachments for user messages */}
                  {message.role === "user" && messageAttachments[message.id] && messageAttachments[message.id].length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#66BB6A]/20">
                      <div className="flex flex-wrap gap-1">
                        {messageAttachments[message.id].map((attachment: any) => (
                          <div key={attachment.id} className="flex items-center bg-white/50 rounded px-2 py-1 text-xs border border-[#66BB6A]/30">
                            <FileText className="h-3 w-3 mr-1 text-[#66BB6A]" />
                            <span className="truncate max-w-[120px] font-medium">{attachment.fileName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 border border-[#E0E0E0]">
                    <AvatarFallback className="bg-gray-200 text-gray-700">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {/* Document Reports Section */}
            {documentReports.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Generated Documents
                </h3>
                <div className="space-y-2">
                  {documentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                        <p className="text-xs text-gray-500">Generated on {new Date(report.created_at).toLocaleString()}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Create a Blob with the report content
                          const blob = new Blob([report.content], { type: 'text/markdown' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t border-[#E0E0E0] p-4 flex-shrink-0">
        <div className="w-full space-y-3">
          {/* Uploaded Files Display - Above Input */}
          {uploadedFiles.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 flex items-center">
                  <Paperclip className="h-3 w-3 mr-1" />
                  Attached Files ({uploadedFiles.length})
                </span>
                <button 
                  type="button"
                  onClick={() => setUploadedFiles([])}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center bg-white rounded-md px-2 py-1 text-xs border border-gray-200 shadow-sm">
                    <FileText className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="truncate max-w-[100px] font-medium">{file.name}</span>
                    <button 
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <form onSubmit={handleFormSubmit} className="flex w-full gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <Button 
            type="button"
            variant="outline" 
            size="icon"
            onClick={handleFileUploadClick}
            className="border-[#E0E0E0]"
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Upload file</span>
          </Button>
          <Input
            placeholder={`Continue your conversation with ${gptName}...`}
            value={input}
            onChange={handleInputChange}
            className="flex-1 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
            disabled={isLoading}
          />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </CardFooter>
    </Card>
  )
}
