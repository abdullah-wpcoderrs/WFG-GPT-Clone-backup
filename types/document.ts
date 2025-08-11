export interface DocumentReport {
  id: string
  sessionId: string
  title: string
  content: string
  format: 'pdf' | 'docx' | 'txt'
  createdAt: string
  generatedBy: string
  status: 'generating' | 'completed' | 'failed'
}

export interface DocumentRequest {
  id: string
  sessionId: string
  prompt: string
  createdAt: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}
