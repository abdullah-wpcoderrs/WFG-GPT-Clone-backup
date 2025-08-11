"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2, FileText } from "lucide-react"
import { getAllSessionContexts, removeDocumentContext } from "@/lib/context-manager"
import { useAuth } from "@/hooks/use-auth"
import { canManageDocumentContexts } from "@/lib/rbac"
import { createApprovalRequest, canCreateApprovals } from "@/lib/approval-manager"
import type { SessionContext } from "@/lib/context-manager"

export function DocumentContextManager() {
  const { user } = useAuth()
  const [sessionContexts, setSessionContexts] = useState<SessionContext[]>([])
  
  // Check if user has permission to manage document contexts
  const canManage = canManageDocumentContexts(user)
  
  // Check if user can create approval requests
  const canCreateApproval = canCreateApprovals(user)
  
  useEffect(() => {
    loadDocumentContexts()
  }, [])
  
  const loadDocumentContexts = () => {
    const contexts = getAllSessionContexts()
    setSessionContexts(contexts)
  }
  
  const handleRemoveDocument = (sessionId: string, documentId: string) => {
    if (!user) return
    
    // If user can manage directly, remove immediately
    if (canManage) {
      removeDocumentContext(sessionId, documentId)
      loadDocumentContexts()
      return
    }
    
    // If user can create approvals, create an approval request
    if (canCreateApproval) {
      createApprovalRequest(
        "document_context_delete",
        user.id,
        {
          sessionId,
          documentId,
          reason: "User requested document context removal"
        }
      )
      // In a real app, we would show a notification to the user
      alert("Approval request created. Your request will be reviewed by an admin.")
      loadDocumentContexts()
      return
    }
    
    // User doesn't have permission to manage or create approvals
    alert("You don't have permission to remove document contexts.")
  }
  
  const handleClearAllContexts = () => {
    if (!user) return
    
    // If user can manage directly, clear all immediately
    if (canManage) {
      // Clear all contexts by reloading and removing each one
      const contexts = getAllSessionContexts()
      contexts.forEach(context => {
        context.documentContexts.forEach(doc => {
          removeDocumentContext(context.sessionId, doc.id)
        })
      })
      loadDocumentContexts()
      return
    }
    
    // If user can create approvals, create an approval request
    if (canCreateApproval) {
      createApprovalRequest(
        "document_context_delete",
        user.id,
        {
          reason: "User requested clearing all document contexts"
        }
      )
      // In a real app, we would show a notification to the user
      alert("Approval request created. Your request will be reviewed by an admin.")
      loadDocumentContexts()
      return
    }
    
    // User doesn't have permission to manage or create approvals
    alert("You don't have permission to clear document contexts.")
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }
  
  return (
    <Card className="border-[#E0E0E0] shadow-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-[#2C2C2C]">Document Contexts</CardTitle>
            <CardDescription>
              Uploaded documents and their parsed contexts
            </CardDescription>
          </div>
          {canManage && (
            <Button 
              variant="outline" 
              onClick={handleClearAllContexts}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Clear All Contexts
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Key Points</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionContexts.length > 0 ? (
                sessionContexts.flatMap(context => 
                  context.documentContexts.map(doc => (
                    <TableRow key={`${context.sessionId}-${doc.id}`}>
                      <TableCell className="font-medium">
                        {context.sessionId.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-[#66BB6A]" />
                          <span className="truncate max-w-[150px]">{doc.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {doc.summary}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {doc.keyPoints.slice(0, 3).map((point, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(doc.uploadedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        {canManage ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => navigator.clipboard.writeText(doc.content)}
                                className="cursor-pointer"
                              >
                                Copy Content
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleRemoveDocument(context.sessionId, doc.id)}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={() => navigator.clipboard.writeText(doc.content)}
                          >
                            <span className="sr-only">Copy content</span>
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No document contexts found. Upload documents in chat to generate contexts.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
