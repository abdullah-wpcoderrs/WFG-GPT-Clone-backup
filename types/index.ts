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
  last_used: string
  usage_count: number
  status: "active" | "inactive"
  created_by: string
  web_access: boolean
}

export interface ChatSession {
  id: string
  user_id: string
  gpt_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  sender: "user" | "gpt"
  content: string
  created_at: string
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
