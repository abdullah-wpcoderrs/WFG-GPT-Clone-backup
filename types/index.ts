export interface User {
  id: string
  email: string
  full_name: string
  role: "user" | "admin" | "super_admin"
  team_id: string
  team_name: string
  avatar?: string
}

export interface Team {
  id: string
  name: string
  members: User[]
}

export interface GPT {
  id: string
  name: string
  description: string
  team_name: string
  team_id: string
  last_used: string
  usage_count: number
  status: "active" | "inactive" | "pending" | "suspended"
  created_by: string
  web_access: boolean
  approval_status?: "approved" | "pending" | "rejected"
  created_at?: string
  updated_at?: string
  active_users?: number
  model?: string
  monthly_cost?: number
  compliance_score?: number
  risk_level?: "low" | "medium" | "high"
  access_level?: "team" | "organization"
}

export interface ChatSession {
  id: string
  user_id: string
  gpt_id: string
  gpt_name: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
  status: "active" | "completed" | "archived"
}

export interface ChatMessage {
  id: string
  session_id: string
  sender: "user" | "gpt"
  content: string
  created_at: string
  attachments?: MessageAttachment[]
}

export interface MessageAttachment {
  id: string
  fileName: string
  fileSize: number
  fileType: string
}

export interface Document {
  id: string
  name: string
  gpt_id: string
  uploaded_by: string
  file_url: string
  created_at: string
  team_id?: string
}

export interface DocumentReport {
  id: string
  session_id: string
  title: string
  content: string
  format: 'pdf' | 'docx' | 'txt'
  created_at: string
  generated_by: string
  status: 'generating' | 'completed' | 'failed'
}

export interface DocumentRequest {
  id: string
  session_id: string
  prompt: string
  created_at: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}
