"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Check, X, Eye } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { 
  getApprovalRequests, 
  getApprovalRequestsByStatus, 
  getApprovalStats,
  updateApprovalRequestStatus,
  deleteApprovalRequest,
  canReviewApprovals
} from "@/lib/approval-manager"
import { removeMemoryItem, clearMemory } from "@/lib/chat-memory"
import { removeDocumentContext } from "@/lib/context-manager"
import type { ApprovalRequest, ApprovalStatus } from "@/types/approval"
import { mockUsers } from "@/lib/mock-data"

export default function AdminApprovalsPage() {
  const { user } = useAuth()
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([])
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | "all">("all")
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  })
  
  // Check if user has permission to review approvals
  const canReview = canReviewApprovals(user)
  
  // Load approval requests and stats
  useEffect(() => {
    loadApprovalData()
  }, [filterStatus])
  
  const loadApprovalData = () => {
    // Get stats
    const approvalStats = getApprovalStats()
    setStats(approvalStats)
    
    // Get requests based on filter
    let requests: ApprovalRequest[]
    if (filterStatus === "all") {
      requests = getApprovalRequests()
    } else {
      requests = getApprovalRequestsByStatus(filterStatus)
    }
    
    setApprovalRequests(requests)
  }
  
  const handleApproveRequest = (id: string) => {
    if (!canReview || !user) return
    
    // Get the request to process it
    const request = getApprovalRequests().find(req => req.id === id)
    if (!request) return
    
    // Process the request based on its type
    switch (request.type) {
      case "memory_delete":
        if (request.details.memoryId) {
          removeMemoryItem(request.details.memoryId)
        } else {
          // Clear all memory
          clearMemory()
        }
        break
      case "document_context_delete":
        if (request.details.sessionId && request.details.documentId) {
          removeDocumentContext(request.details.sessionId, request.details.documentId)
        }
        break
      // Other cases would be handled here
    }
    
    // Update the request status
    updateApprovalRequestStatus(id, "approved", user.id, "Approved and processed by admin")
    loadApprovalData()
  }
  
  const handleRejectRequest = (id: string) => {
    if (!canReview || !user) return
    updateApprovalRequestStatus(id, "rejected", user.id, "Rejected by admin")
    loadApprovalData()
  }
  
  const handleDeleteRequest = (id: string) => {
    if (!canReview) return
    deleteApprovalRequest(id)
    loadApprovalData()
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
  
  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }
  
  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      "memory_delete": "Delete Memory",
      "memory_edit": "Edit Memory",
      "document_context_delete": "Delete Document Context",
      "document_context_edit": "Edit Document Context",
      "gpt_create": "Create GPT",
      "gpt_update": "Update GPT",
      "gpt_delete": "Delete GPT",
      "team_create": "Create Team",
      "team_update": "Update Team",
      "team_delete": "Delete Team"
    }
    
    return typeLabels[type] || type
  }
  
  const getUserName = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId)
    return foundUser ? foundUser.full_name : "Unknown User"
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2C2C2C]">Approval Management</h1>
        <p className="text-[#666666] mt-2">
          Review and manage approval requests for memory items, document contexts, and system changes.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2C2C2C]">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Approval Requests Table */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold text-[#2C2C2C]">Approval Requests</CardTitle>
              <CardDescription>
                All pending and completed approval requests
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ApprovalStatus | "all")}
                className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button 
                variant="outline" 
                onClick={loadApprovalData}
                className="border-[#E0E0E0] text-[#2C2C2C] hover:bg-[#F5F5F5]"
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Requested At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviewed By</TableHead>
                  <TableHead>Reviewed At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvalRequests.length > 0 ? (
                  approvalRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {getTypeLabel(request.type)}
                      </TableCell>
                      <TableCell>
                        {getUserName(request.requestedBy)}
                      </TableCell>
                      <TableCell>
                        {formatDate(request.requestedAt)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        {request.reviewedBy ? getUserName(request.reviewedBy) : "-"}
                      </TableCell>
                      <TableCell>
                        {request.reviewedAt ? formatDate(request.reviewedAt) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {canReview && request.status === "pending" ? (
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              <span className="sr-only">Approve</span>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <span className="sr-only">Reject</span>
                              <X className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => console.log("View details", request)}
                                  className="cursor-pointer"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteRequest(request.id)}
                                  className="cursor-pointer text-red-600"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Delete Request
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ) : (
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => console.log("View details", request)}
                          >
                            <span className="sr-only">View details</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      No approval requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
