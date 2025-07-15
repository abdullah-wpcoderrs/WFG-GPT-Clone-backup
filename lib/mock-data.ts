"use client"

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin" | "superadmin"
  avatar?: string
  team?: string
  status: "active" | "inactive"
  lastLogin: string
  createdAt: string
}

export interface GPT {
  id: string
  name: string
  description: string
  category: string
  status: "active" | "inactive" | "draft"
  creator: string
  createdAt: string
  updatedAt: string
  usageCount: number
  rating: number
  tags: string[]
  isPublic: boolean
  teamId?: string
  prompt?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface ChatSession {
  id: string
  title: string
  user_id: string
  gpt_id: string
  gpt_name: string
  status: "active" | "completed" | "archived"
  message_count: number
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  sender: "user" | "assistant"
  content: string
  created_at: string
}

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "user",
    team: "Engineering",
    status: "active",
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "admin-1",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "admin",
    team: "Engineering",
    status: "active",
    lastLogin: "2024-01-15T09:15:00Z",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "superadmin-1",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "superadmin",
    status: "active",
    lastLogin: "2024-01-15T08:45:00Z",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export const mockGPTs: GPT[] = [
  {
    id: "gpt-1",
    name: "Code Assistant",
    description: "Helps with coding tasks, debugging, and code reviews",
    category: "Development",
    status: "active",
    creator: "admin-1",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
    usageCount: 245,
    rating: 4.8,
    tags: ["coding", "debugging", "review"],
    isPublic: true,
    teamId: "team-1",
    prompt: "You are a helpful coding assistant...",
    model: "gpt-4",
    temperature: 0.3,
    maxTokens: 2000,
  },
  {
    id: "gpt-2",
    name: "Content Writer",
    description: "Creates engaging content for marketing and documentation",
    category: "Content",
    status: "active",
    creator: "admin-1",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    usageCount: 189,
    rating: 4.6,
    tags: ["writing", "marketing", "documentation"],
    isPublic: true,
    teamId: "team-1",
    prompt: "You are a professional content writer...",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 3000,
  },
  {
    id: "gpt-3",
    name: "Data Analyst",
    description: "Analyzes data and provides insights",
    category: "Analytics",
    status: "active",
    creator: "superadmin-1",
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-13T00:00:00Z",
    usageCount: 156,
    rating: 4.7,
    tags: ["data", "analytics", "insights"],
    isPublic: true,
    prompt: "You are a data analysis expert...",
    model: "gpt-4",
    temperature: 0.2,
    maxTokens: 2500,
  },
]

export const mockChatSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "Debug React Component",
    user_id: "user-1",
    gpt_id: "gpt-1",
    gpt_name: "Code Assistant",
    status: "active",
    message_count: 8,
    created_at: "2024-01-15T09:00:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "session-2",
    title: "Write Product Description",
    user_id: "user-1",
    gpt_id: "gpt-2",
    gpt_name: "Content Writer",
    status: "completed",
    message_count: 5,
    created_at: "2024-01-14T14:00:00Z",
    updated_at: "2024-01-14T15:30:00Z",
  },
  {
    id: "session-3",
    title: "API Integration Help",
    user_id: "admin-1",
    gpt_id: "gpt-1",
    gpt_name: "Code Assistant",
    status: "active",
    message_count: 12,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T11:45:00Z",
  },
  {
    id: "session-4",
    title: "Sales Report Analysis",
    user_id: "admin-1",
    gpt_id: "gpt-3",
    gpt_name: "Data Analyst",
    status: "completed",
    message_count: 6,
    created_at: "2024-01-13T10:00:00Z",
    updated_at: "2024-01-13T12:00:00Z",
  },
  {
    id: "session-5",
    title: "System Architecture Review",
    user_id: "superadmin-1",
    gpt_id: "gpt-1",
    gpt_name: "Code Assistant",
    status: "active",
    message_count: 15,
    created_at: "2024-01-14T16:00:00Z",
    updated_at: "2024-01-15T09:30:00Z",
  },
  {
    id: "session-6",
    title: "Marketing Campaign Ideas",
    user_id: "superadmin-1",
    gpt_id: "gpt-2",
    gpt_name: "Content Writer",
    status: "completed",
    message_count: 9,
    created_at: "2024-01-12T11:00:00Z",
    updated_at: "2024-01-12T13:30:00Z",
  },
]

export const mockChatMessages: ChatMessage[] = [
  // Session 1 messages (Debug React Component)
  {
    id: "msg-1",
    session_id: "session-1",
    sender: "user",
    content: "I'm having trouble with my React component. It's not rendering properly.",
    created_at: "2024-01-15T09:00:00Z",
  },
  {
    id: "msg-2",
    session_id: "session-1",
    sender: "assistant",
    content:
      "I'd be happy to help you debug your React component! Can you share the code that's not rendering properly?",
    created_at: "2024-01-15T09:01:00Z",
  },
  {
    id: "msg-3",
    session_id: "session-1",
    sender: "user",
    content:
      "Here's the component:\n\n```jsx\nfunction MyComponent() {\n  const [data, setData] = useState();\n  return <div>{data.name}</div>;\n}\n```",
    created_at: "2024-01-15T09:02:00Z",
  },
  {
    id: "msg-4",
    session_id: "session-1",
    sender: "assistant",
    content:
      "I see the issue! The problem is that `data` is initially `undefined`, so accessing `data.name` will cause an error. You should add a conditional check or provide a default value.",
    created_at: "2024-01-15T09:03:00Z",
  },

  // Session 2 messages (Write Product Description)
  {
    id: "msg-5",
    session_id: "session-2",
    sender: "user",
    content: "I need help writing a product description for our new wireless headphones.",
    created_at: "2024-01-14T14:00:00Z",
  },
  {
    id: "msg-6",
    session_id: "session-2",
    sender: "assistant",
    content:
      "I'd be happy to help you create a compelling product description! Can you tell me about the key features and target audience for these wireless headphones?",
    created_at: "2024-01-14T14:01:00Z",
  },
  {
    id: "msg-7",
    session_id: "session-2",
    sender: "user",
    content:
      "They have noise cancellation, 30-hour battery life, and are targeted at professionals who work from home.",
    created_at: "2024-01-14T14:05:00Z",
  },

  // Session 3 messages (API Integration Help)
  {
    id: "msg-8",
    session_id: "session-3",
    sender: "user",
    content: "I'm trying to integrate a REST API into our application but getting CORS errors.",
    created_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "msg-9",
    session_id: "session-3",
    sender: "assistant",
    content:
      "CORS errors are common when working with APIs. Can you tell me more about your setup? Are you making requests from a browser to a different domain?",
    created_at: "2024-01-15T08:01:00Z",
  },

  // Session 4 messages (Sales Report Analysis)
  {
    id: "msg-10",
    session_id: "session-4",
    sender: "user",
    content: "Can you help me analyze our Q4 sales data? I have the numbers but need insights.",
    created_at: "2024-01-13T10:00:00Z",
  },
  {
    id: "msg-11",
    session_id: "session-4",
    sender: "assistant",
    content:
      "I'd be happy to help analyze your Q4 sales data. Please share the data you have, and I'll provide insights on trends, performance, and recommendations.",
    created_at: "2024-01-13T10:01:00Z",
  },

  // Session 5 messages (System Architecture Review)
  {
    id: "msg-12",
    session_id: "session-5",
    sender: "user",
    content: "I need a review of our current system architecture. We're experiencing scalability issues.",
    created_at: "2024-01-14T16:00:00Z",
  },
  {
    id: "msg-13",
    session_id: "session-5",
    sender: "assistant",
    content:
      "I'd be glad to help review your system architecture for scalability improvements. Can you describe your current setup, including the tech stack, database, and where you're seeing bottlenecks?",
    created_at: "2024-01-14T16:01:00Z",
  },

  // Session 6 messages (Marketing Campaign Ideas)
  {
    id: "msg-14",
    session_id: "session-6",
    sender: "user",
    content: "We're launching a new product next month and need creative marketing campaign ideas.",
    created_at: "2024-01-12T11:00:00Z",
  },
  {
    id: "msg-15",
    session_id: "session-6",
    sender: "assistant",
    content:
      "Exciting! I'd love to help brainstorm marketing campaign ideas for your product launch. Can you tell me more about the product, target audience, and budget range?",
    created_at: "2024-01-12T11:01:00Z",
  },
]
