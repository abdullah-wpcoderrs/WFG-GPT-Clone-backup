import type { User, Project, Document, Template, ChatSession, ChatMessage, GPT } from "@/types"

// Mock Users with correct login credentials
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "user@test.com",
    role: "user",
    avatar: "/placeholder-user.jpg",
    createdAt: new Date("2024-01-15"),
    lastActive: new Date("2024-01-20"),
    status: "active",
    teamId: "team-1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "admin@test.com",
    role: "admin",
    avatar: "/placeholder-user.jpg",
    createdAt: new Date("2024-01-10"),
    lastActive: new Date("2024-01-20"),
    status: "active",
    teamId: "team-1",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "superadmin@test.com",
    role: "super_admin",
    avatar: "/placeholder-user.jpg",
    createdAt: new Date("2024-01-05"),
    lastActive: new Date("2024-01-20"),
    status: "active",
    teamId: "team-1",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@company.com",
    role: "user",
    avatar: "/placeholder-user.jpg",
    createdAt: new Date("2024-01-12"),
    lastActive: new Date("2024-01-19"),
    status: "active",
    teamId: "team-2",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@company.com",
    role: "admin",
    avatar: "/placeholder-user.jpg",
    createdAt: new Date("2024-01-08"),
    lastActive: new Date("2024-01-18"),
    status: "active",
    teamId: "team-2",
  },
]

// ─────────────────────────────────────────────────────────────────────────
// GPTs
// ─────────────────────────────────────────────────────────────────────────
export const mockGPTs: GPT[] = [
  {
    id: "gpt-1",
    name: "Code Assistant",
    description: "Helps with coding tasks, debugging, and code reviews",
    category: "Development",
    status: "active",
    creator: "admin-1",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-14"),
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
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-15"),
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
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-13"),
    usageCount: 156,
    rating: 4.7,
    tags: ["data", "analytics", "insights"],
    isPublic: true,
    prompt: "You are a data analysis expert...",
    model: "gpt-4",
    temperature: 0.2,
    maxTokens: 2500,
  },
  {
    id: "gpt-4",
    name: "Marketing Strategist",
    description: "Generates marketing strategies and campaign ideas",
    category: "Marketing",
    status: "active",
    creator: "superadmin-1",
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-16"),
    usageCount: 132,
    rating: 4.5,
    tags: ["marketing", "strategy", "campaign"],
    isPublic: true,
    prompt: "You are a seasoned marketing strategist...",
    model: "gpt-4",
    temperature: 0.6,
    maxTokens: 2200,
  },
]

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    userId: "1",
    teamId: "team-1",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "New mobile application for customer engagement",
    status: "active",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    userId: "1",
    teamId: "team-1",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q1 marketing campaign planning and execution",
    status: "completed",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-15"),
    userId: "4",
    teamId: "team-2",
  },
]

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Project Requirements.pdf",
    type: "pdf",
    size: 2048000,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    userId: "1",
    projectId: "1",
  },
  {
    id: "2",
    name: "Design Mockups.figma",
    type: "figma",
    size: 5120000,
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-18"),
    userId: "1",
    projectId: "1",
  },
  {
    id: "3",
    name: "Meeting Notes.docx",
    type: "docx",
    size: 512000,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    userId: "4",
    projectId: "3",
  },
]

// Mock Templates
export const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Project Brief Template",
    description: "Standard template for project briefs",
    content: "# Project Brief\n\n## Objective\n\n## Scope\n\n## Timeline\n\n## Resources",
    category: "project",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    userId: "2",
  },
  {
    id: "2",
    name: "Meeting Agenda Template",
    description: "Template for team meeting agendas",
    content: "# Meeting Agenda\n\n## Date & Time\n\n## Attendees\n\n## Agenda Items\n\n## Action Items",
    category: "meeting",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
    userId: "2",
  },
]

// Mock Chat Sessions
export const mockChatSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "Website Design Discussion",
    gptId: "gpt-1",
    userId: "1",
    createdAt: new Date("2024-01-20T10:00:00"),
    updatedAt: new Date("2024-01-20T14:30:00"),
    messageCount: 8,
  },
  {
    id: "session-2",
    title: "Marketing Strategy Planning",
    gptId: "gpt-2",
    userId: "1",
    createdAt: new Date("2024-01-19T09:15:00"),
    updatedAt: new Date("2024-01-19T16:45:00"),
    messageCount: 12,
  },
  {
    id: "session-3",
    title: "Code Review Assistant",
    gptId: "gpt-3",
    userId: "1",
    createdAt: new Date("2024-01-18T11:30:00"),
    updatedAt: new Date("2024-01-18T15:20:00"),
    messageCount: 6,
  },
  {
    id: "session-4",
    title: "Content Creation Help",
    gptId: "gpt-1",
    userId: "2",
    createdAt: new Date("2024-01-17T13:00:00"),
    updatedAt: new Date("2024-01-17T17:30:00"),
    messageCount: 15,
  },
  {
    id: "session-5",
    title: "Data Analysis Discussion",
    gptId: "gpt-4",
    userId: "3",
    createdAt: new Date("2024-01-16T08:45:00"),
    updatedAt: new Date("2024-01-16T12:15:00"),
    messageCount: 9,
  },
]

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  // Session 1 messages
  {
    id: "msg-1",
    sessionId: "session-1",
    content: "I need help designing a modern website layout for our company. What are the current design trends?",
    role: "user",
    timestamp: new Date("2024-01-20T10:00:00"),
  },
  {
    id: "msg-2",
    sessionId: "session-1",
    content:
      "I'd be happy to help you with modern website design trends! Here are some key trends for 2024:\n\n1. **Minimalist Design**: Clean, uncluttered layouts with plenty of white space\n2. **Bold Typography**: Large, eye-catching fonts as design elements\n3. **Dark Mode**: Offering both light and dark theme options\n4. **Micro-interactions**: Subtle animations that enhance user experience\n5. **Mobile-first Design**: Responsive layouts optimized for mobile devices\n\nWhat type of company website are you designing? This will help me provide more specific recommendations.",
    role: "assistant",
    timestamp: new Date("2024-01-20T10:02:00"),
  },
  {
    id: "msg-3",
    sessionId: "session-1",
    content:
      "It's for a tech startup focused on AI solutions. We want something that looks innovative and trustworthy.",
    role: "user",
    timestamp: new Date("2024-01-20T10:05:00"),
  },
  {
    id: "msg-4",
    sessionId: "session-1",
    content:
      "Perfect! For an AI tech startup, here are some specific design recommendations:\n\n**Color Palette:**\n- Primary: Deep blues or teals (convey trust and technology)\n- Accent: Bright cyan or electric blue (innovation)\n- Neutral: Clean grays and whites\n\n**Visual Elements:**\n- Geometric patterns or subtle grid overlays\n- Abstract tech illustrations\n- Data visualization elements\n- Gradient overlays on hero sections\n\n**Layout Structure:**\n- Hero section with clear value proposition\n- Product/service showcase with interactive demos\n- Trust indicators (testimonials, logos, certifications)\n- Clear call-to-action buttons\n\nWould you like me to elaborate on any of these elements?",
    role: "assistant",
    timestamp: new Date("2024-01-20T10:08:00"),
  },
  // Session 2 messages
  {
    id: "msg-5",
    sessionId: "session-2",
    content: "Help me create a comprehensive marketing strategy for our new product launch.",
    role: "user",
    timestamp: new Date("2024-01-19T09:15:00"),
  },
  {
    id: "msg-6",
    sessionId: "session-2",
    content:
      "I'll help you create a comprehensive marketing strategy! Let's start with the foundation:\n\n**1. Product & Market Analysis**\n- What's your product and its unique value proposition?\n- Who is your target audience?\n- What's your competitive landscape?\n\n**2. Marketing Objectives**\n- Launch awareness goals\n- Lead generation targets\n- Revenue objectives\n- Timeline for launch\n\n**3. Channel Strategy**\n- Digital marketing (social media, content, email)\n- Traditional marketing (if applicable)\n- Partnership and influencer marketing\n- PR and media outreach\n\nCan you tell me more about your product and target audience so I can provide more specific recommendations?",
    role: "assistant",
    timestamp: new Date("2024-01-19T09:18:00"),
  },
]

// Mock Teams
export const mockTeams = [
  {
    id: "team-1",
    name: "Development Team",
    description: "Frontend and backend developers",
    memberCount: 8,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "team-2",
    name: "Marketing Team",
    description: "Marketing and content creation",
    memberCount: 5,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "team-3",
    name: "Design Team",
    description: "UI/UX designers and graphic artists",
    memberCount: 4,
    createdAt: new Date("2024-01-01"),
  },
]
