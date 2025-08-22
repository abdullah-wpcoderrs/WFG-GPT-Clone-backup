import type { User, Document, ChatSession, ChatMessage, GPT, Project } from "@/types"

// Mock Users with correct login credentials
export const mockUsers: User[] = [
  {
    id: "1",
    email: "user@test.com",
    full_name: "John Doe",
    role: "user",
    team_id: "team-1",
    team_name: "Development Team",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    email: "admin@test.com",
    full_name: "Jane Smith",
    role: "admin",
    team_id: "team-1",
    team_name: "Development Team",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    email: "superadmin@test.com",
    full_name: "Mike Johnson",
    role: "super_admin",
    team_id: "team-1",
    team_name: "Development Team",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "4",
    email: "sarah@company.com",
    full_name: "Sarah Wilson",
    role: "user",
    team_id: "team-2",
    team_name: "Marketing Team",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "5",
    email: "david@company.com",
    full_name: "David Brown",
    role: "admin",
    team_id: "team-2",
    team_name: "Marketing Team",
    avatar: "/placeholder-user.jpg",
  },
]

// ─────────────────────────────────────────────────────────────────────────
// GPTs
// ─────────────────────────────────────────────────────────────────────────
export const mockGPTs: GPT[] = [
  {
    id: "gpt-1",
    name: "Design Assistant",
    description: "Helps with UI/UX design and frontend development",
    team_id: "team-1",
    team_name: "Development Team",
    last_used: new Date().toISOString(),
    usage_count: 15,
    status: "active",
    created_by: "admin-1",
    web_access: true,
    model: "gpt-4",
    created_at: new Date("2024-01-15").toISOString(),
    updated_at: new Date("2024-01-20").toISOString(),
    active_users: 8,
  },
  {
    id: "gpt-2",
    name: "Content Writer",
    description: "Creates engaging content for marketing and documentation",
    team_id: "team-1",
    team_name: "Development Team",
    last_used: new Date().toISOString(),
    usage_count: 22,
    status: "active",
    created_by: "admin-1",
    web_access: false,
    model: "gpt-4",
    created_at: new Date("2024-01-05").toISOString(),
    updated_at: new Date("2024-01-15").toISOString(),
    active_users: 8,
  },
  {
    id: "gpt-3",
    name: "Code Reviewer",
    description: "Reviews code and suggests improvements",
    team_id: "team-1",
    team_name: "Development Team",
    last_used: new Date().toISOString(),
    usage_count: 12,
    status: "active",
    created_by: "admin-1",
    web_access: true,
    model: "gpt-4",
    created_at: new Date("2024-01-10").toISOString(),
    updated_at: new Date("2024-01-18").toISOString(),
    active_users: 5,
  },
  {
    id: "gpt-4",
    name: "Marketing Strategist",
    description: "Creates marketing strategies and content",
    team_id: "team-2",
    team_name: "Marketing Team",
    last_used: new Date().toISOString(),
    usage_count: 10,
    status: "active",
    created_by: "admin-2",
    web_access: true,
    model: "gpt-4",
    created_at: new Date("2024-01-08").toISOString(),
    updated_at: new Date("2024-01-16").toISOString(),
    active_users: 3,
  },
]

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Q1 Marketing Campaign",
    description: "Launch campaign for the new product line.",
    status: "active",
    team_id: "team-2",
  },
  {
    id: "project-2",
    name: "Website Redesign",
    description: "Complete redesign of the corporate website.",
    status: "active",
    team_id: "team-1",
  },
  {
    id: "project-3",
    name: "Mobile App Development",
    description: "Develop the new iOS and Android applications.",
    status: "completed",
    team_id: "team-1",
  },
  {
    id: "project-4",
    name: "Internal Knowledge Base",
    description: "Create a centralized wiki for all teams.",
    status: "inactive",
    team_id: "team-3",
  },
]

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Project Requirements.pdf",
    gpt_id: "gpt-1",
    uploaded_by: "1",
    file_url: "/documents/project-requirements.pdf",
    created_at: new Date("2024-01-15").toISOString(),
    team_id: "team-1",
    size: 1258291, // 1.2 MB
    type: "pdf",
  },
  {
    id: "2",
    name: "Design Mockups.figma",
    gpt_id: "gpt-1",
    uploaded_by: "1",
    file_url: "/documents/design-mockups.figma",
    created_at: new Date("2024-01-16").toISOString(),
    team_id: "team-1",
    size: 5662310, // 5.4 MB
    type: "figma",
  },
  {
    id: "3",
    name: "Meeting Notes.docx",
    gpt_id: "gpt-2",
    uploaded_by: "4",
    file_url: "/documents/meeting-notes.docx",
    created_at: new Date("2024-01-12").toISOString(),
    team_id: "team-2",
    size: 262144, // 256 KB
    type: "docx",
  },
]

// Mock Documents
// Mock Chat Sessions
export const mockChatSessions: ChatSession[] = [
  {
    id: "session-1",
    user_id: "1",
    gpt_id: "gpt-1",
    gpt_name: "Design Assistant",
    title: "Website Design Discussion",
    created_at: new Date("2024-01-20T10:00:00").toISOString(),
    updated_at: new Date("2024-01-20T14:30:00").toISOString(),
    message_count: 8,
    status: "active",
  },
  {
    id: "session-2",
    user_id: "1",
    gpt_id: "gpt-2",
    gpt_name: "Content Writer",
    title: "Marketing Strategy Planning",
    created_at: new Date("2024-01-19T09:15:00").toISOString(),
    updated_at: new Date("2024-01-19T16:45:00").toISOString(),
    message_count: 12,
    status: "active",
  },
  {
    id: "session-3",
    user_id: "1",
    gpt_id: "gpt-3",
    gpt_name: "Code Reviewer",
    title: "Code Review Assistant",
    created_at: new Date("2024-01-18T11:30:00").toISOString(),
    updated_at: new Date("2024-01-18T15:20:00").toISOString(),
    message_count: 6,
    status: "active",
  },
  {
    id: "session-4",
    user_id: "2",
    gpt_id: "gpt-1",
    gpt_name: "Design Assistant",
    title: "Content Creation Help",
    created_at: new Date("2024-01-17T13:00:00").toISOString(),
    updated_at: new Date("2024-01-17T17:30:00").toISOString(),
    message_count: 15,
    status: "active",
  },
  {
    id: "session-5",
    user_id: "3",
    gpt_id: "gpt-4",
    gpt_name: "Marketing Strategist",
    title: "Data Analysis Discussion",
    created_at: new Date("2024-01-16T08:45:00").toISOString(),
    updated_at: new Date("2024-01-16T12:15:00").toISOString(),
    message_count: 9,
    status: "active",
  },
]

// Mock Chat Sessions
// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  // Session 1 messages
  {
    id: "msg-1",
    session_id: "session-1",
    sender: "user",
    content: "I need help designing a modern website layout for our company. What are the current design trends?",
    created_at: new Date("2024-01-20T10:00:00").toISOString(),
  },
  {
    id: "msg-2",
    session_id: "session-1",
    sender: "gpt",
    content:
      "I'd be happy to help you with modern website design trends! Here are some key trends for 2024:\n\n1. **Minimalist Design**: Clean, uncluttered layouts with plenty of white space\n2. **Bold Typography**: Large, eye-catching fonts as design elements\n3. **Dark Mode**: Offering both light and dark theme options\n4. **Micro-interactions**: Subtle animations that enhance user experience\n5. **Mobile-first Design**: Responsive layouts optimized for mobile devices\n\nWhat type of company website are you designing? This will help me provide more specific recommendations.",
    created_at: new Date("2024-01-20T10:02:00").toISOString(),
  },
  {
    id: "msg-3",
    session_id: "session-1",
    sender: "user",
    content:
      "It's for a tech startup focused on AI solutions. We want something that looks innovative and trustworthy.",
    created_at: new Date("2024-01-20T10:05:00").toISOString(),
  },
  {
    id: "msg-4",
    session_id: "session-1",
    sender: "gpt",
    content:
      "Perfect! For an AI tech startup, here are some specific design recommendations:\n\n**Color Palette:**\n- Primary: Deep blues or teals (convey trust and technology)\n- Accent: Bright cyan or electric blue (innovation)\n- Neutral: Clean grays and whites\n\n**Visual Elements:**\n- Geometric patterns or subtle grid overlays\n- Abstract tech illustrations\n- Data visualization elements\n- Gradient overlays on hero sections\n\n**Layout Structure:**\n- Hero section with clear value proposition\n- Product/service showcase with interactive demos\n- Trust indicators (testimonials, logos, certifications)\n- Clear call-to-action buttons\n\nWould you like me to elaborate on any of these elements?",
    created_at: new Date("2024-01-20T10:08:00").toISOString(),
  },
  // Session 2 messages
  {
    id: "msg-5",
    session_id: "session-2",
    sender: "user",
    content: "Help me create a comprehensive marketing strategy for our new product launch.",
    created_at: new Date("2024-01-19T09:15:00").toISOString(),
  },
  {
    id: "msg-6",
    session_id: "session-2",
    sender: "gpt",
    content:
      "I'll help you create a comprehensive marketing strategy! Let's start with the foundation:\n\n**1. Product & Market Analysis**\n- What's your product and its unique value proposition?\n- Who is your target audience?\n- What's your competitive landscape?\n\n**2. Marketing Objectives**\n- Launch awareness goals\n- Lead generation targets\n- Revenue objectives\n- Timeline for launch\n\n**3. Channel Strategy**\n- Digital marketing (social media, content, email)\n- Traditional marketing (if applicable)\n- Partnership and influencer marketing\n- PR and media outreach\n\nCan you tell me more about your product and target audience so I can provide more specific recommendations?",
    created_at: new Date("2024-01-19T09:18:00").toISOString(),
  },
]

// Mock Document Reports
export const mockDocumentReports = [
  {
    id: "report-1",
    sessionId: "session-1",
    title: "Website Design Recommendations",
    content: "# Website Design Recommendations\n\n## Executive Summary\nThis document provides comprehensive recommendations for designing a modern website for your AI tech startup.\n\n## Key Design Elements\n1. **Color Palette**\n   - Primary: Deep blues or teals\n   - Accent: Bright cyan or electric blue\n   - Neutral: Clean grays and whites\n\n2. **Visual Elements**\n   - Geometric patterns\n   - Abstract tech illustrations\n   - Data visualization elements\n   - Gradient overlays\n\n3. **Layout Structure**\n   - Hero section with clear value proposition\n   - Product/service showcase\n   - Trust indicators\n   - Clear call-to-action buttons",
    format: "pdf",
    createdAt: new Date("2024-01-20T10:15:00"),
    generatedBy: "gpt-1",
    status: "completed",
  },
  {
    id: "report-2",
    sessionId: "session-2",
    title: "Marketing Strategy Framework",
    content: "# Marketing Strategy Framework\n\n## Overview\nThis document outlines a comprehensive marketing strategy for your product launch.\n\n## Core Components\n1. **Product & Market Analysis**\n2. **Marketing Objectives**\n3. **Channel Strategy**\n4. **Budget Allocation**\n5. **Success Metrics**",
    format: "docx",
    createdAt: new Date("2024-01-19T09:30:00"),
    generatedBy: "gpt-2",
    status: "completed",
  },
]

// Mock Document Requests
export const mockDocumentRequests = [
  {
    id: "req-1",
    sessionId: "session-1",
    prompt: "Generate a detailed report on website design recommendations",
    createdAt: new Date("2024-01-20T10:10:00"),
    status: "completed",
  },
  {
    id: "req-2",
    sessionId: "session-2",
    prompt: "Create a marketing strategy document",
    createdAt: new Date("2024-01-19T09:25:00"),
    status: "completed",
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
