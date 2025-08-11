import type { ApprovalRequest, ApprovalStatus, ApprovalType, ApprovalStats } from "@/types/approval"
import type { User } from "@/types"

// Mock approval requests storage
let mockApprovalRequests: ApprovalRequest[] = [
  {
    id: "approval-1",
    type: "memory_delete",
    status: "pending",
    requestedBy: "user-2",
    requestedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    details: {
      memoryId: "memory-1",
      reason: "Removing outdated information"
    }
  },
  {
    id: "approval-2",
    type: "document_context_delete",
    status: "pending",
    requestedBy: "user-2",
    requestedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    details: {
      sessionId: "session-1",
      documentId: "doc-1",
      reason: "Document contains sensitive information"
    }
  },
  {
    id: "approval-3",
    type: "gpt_update",
    status: "approved",
    requestedBy: "user-2",
    requestedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    reviewedBy: "user-3",
    reviewedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    details: {
      gptId: "gpt-1",
      changes: {
        name: "Updated Customer Support GPT",
        description: "Enhanced customer support capabilities"
      }
    }
  }
]

/**
 * Get all approval requests
 * @returns Array of approval requests
 */
export function getApprovalRequests(): ApprovalRequest[] {
  return mockApprovalRequests
}

/**
 * Get approval requests by status
 * @param status The status to filter by
 * @returns Array of approval requests with the specified status
 */
export function getApprovalRequestsByStatus(status: ApprovalStatus): ApprovalRequest[] {
  return mockApprovalRequests.filter(request => request.status === status)
}

/**
 * Get approval requests by type
 * @param type The type to filter by
 * @returns Array of approval requests with the specified type
 */
export function getApprovalRequestsByType(type: ApprovalType): ApprovalRequest[] {
  return mockApprovalRequests.filter(request => request.type === type)
}

/**
 * Get an approval request by ID
 * @param id The ID of the approval request
 * @returns The approval request or undefined if not found
 */
export function getApprovalRequestById(id: string): ApprovalRequest | undefined {
  return mockApprovalRequests.find(request => request.id === id)
}

/**
 * Create a new approval request
 * @param type The type of approval request
 * @param requestedBy The ID of the user making the request
 * @param details Additional details about the request
 * @returns The created approval request
 */
export function createApprovalRequest(
  type: ApprovalType, 
  requestedBy: string, 
  details: Record<string, any>
): ApprovalRequest {
  const newRequest: ApprovalRequest = {
    id: `approval-${Date.now()}`,
    type,
    status: "pending",
    requestedBy,
    requestedAt: new Date().toISOString(),
    details
  }
  
  mockApprovalRequests.push(newRequest)
  return newRequest
}

/**
 * Update the status of an approval request
 * @param id The ID of the approval request
 * @param status The new status
 * @param reviewedBy The ID of the user reviewing the request
 * @param notes Optional notes about the review
 * @returns The updated approval request or undefined if not found
 */
export function updateApprovalRequestStatus(
  id: string, 
  status: ApprovalStatus, 
  reviewedBy: string, 
  notes?: string
): ApprovalRequest | undefined {
  const request = mockApprovalRequests.find(req => req.id === id)
  if (!request) return undefined
  
  request.status = status
  request.reviewedBy = reviewedBy
  request.reviewedAt = new Date().toISOString()
  if (notes) request.notes = notes
  
  return request
}

/**
 * Delete an approval request
 * @param id The ID of the approval request to delete
 * @returns True if deleted, false if not found
 */
export function deleteApprovalRequest(id: string): boolean {
  const initialLength = mockApprovalRequests.length
  mockApprovalRequests = mockApprovalRequests.filter(request => request.id !== id)
  return mockApprovalRequests.length < initialLength
}

/**
 * Get approval statistics
 * @returns Approval statistics
 */
export function getApprovalStats(): ApprovalStats {
  const pending = mockApprovalRequests.filter(req => req.status === "pending").length
  const approved = mockApprovalRequests.filter(req => req.status === "approved").length
  const rejected = mockApprovalRequests.filter(req => req.status === "rejected").length
  
  return {
    pending,
    approved,
    rejected,
    total: pending + approved + rejected
  }
}

/**
 * Check if a user can review approval requests
 * @param user The user to check
 * @returns Whether the user can review approval requests
 */
export function canReviewApprovals(user: User | null): boolean {
  if (!user) return false
  return user.role === "admin" || user.role === "super_admin"
}

/**
 * Check if a user can create approval requests
 * @param user The user to check
 * @returns Whether the user can create approval requests
 */
export function canCreateApprovals(user: User | null): boolean {
  if (!user) return false
  return user.role === "user" || user.role === "admin" || user.role === "super_admin"
}
