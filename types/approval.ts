export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type ApprovalType = 
  | 'memory_delete'
  | 'memory_edit'
  | 'document_context_delete'
  | 'document_context_edit'
  | 'gpt_create'
  | 'gpt_update'
  | 'gpt_delete'
  | 'team_create'
  | 'team_update'
  | 'team_delete'

export interface ApprovalRequest {
  id: string
  type: ApprovalType
  status: ApprovalStatus
  requestedBy: string
  requestedAt: string
  reviewedBy?: string
  reviewedAt?: string
  details: Record<string, any>
  notes?: string
}

export interface ApprovalStats {
  pending: number
  approved: number
  rejected: number
  total: number
}
