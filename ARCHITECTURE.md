# GPT Desk - Complete Project Architecture

This document provides a comprehensive overview of the GPT Desk application architecture, designed specifically for backend engineers to understand the frontend structure, data flow, user interactions, and integration requirements.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Application Structure](#application-structure)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Page-by-Page Analysis](#page-by-page-analysis)
6. [Component Architecture](#component-architecture)
7. [Data Models & Types](#data-models--types)
8. [API Integration Points](#api-integration-points)
9. [Authentication & Authorization](#authentication--authorization)
10. [UI Interactions & Features](#ui-interactions--features)
11. [Backend Integration Requirements](#backend-integration-requirements)

## Project Overview

GPT Desk is a multi-tenant AI assistant management platform that allows organizations to create, manage, and monitor custom GPT assistants. The application supports three user roles with different levels of access and functionality.

### Core Functionality
- **GPT Management**: Create, configure, and deploy custom AI assistants
- **Chat Interface**: Real-time conversations with AI assistants
- **Document Management**: Upload and share documents across teams
- **Template System**: Create and share prompt templates
- **Analytics & Monitoring**: Track usage, costs, and performance
- **Team Management**: Organize users into teams with role-based access
- **Audit Logging**: Complete activity tracking for compliance

## Technology Stack

### Frontend Framework
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS v3** for styling
- **Radix UI** for headless components

### State Management
- **React Context** for authentication
- **Local state** with useState/useReducer
- **Custom hooks** for data fetching

### Key Libraries
- **Lucide React** for icons
- **AI SDK** for chat streaming
- **clsx & tailwind-merge** for conditional styling
- **date-fns** for date formatting

## Application Structure

```
GPT-Desk/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   └── login/               # Authentication pages
│   ├── dashboard/               # Main application
│   │   ├── user/               # User role pages
│   │   ├── admin/              # Admin role pages
│   │   └── super/              # Super admin pages
│   ├── api/                    # API routes
│   │   ├── chat/               # Chat streaming
│   │   ├── gpts/               # GPT management
│   │   └── supabase/           # Supabase integration
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Root redirect
├── components/                  # Reusable components
│   ├── layout/                 # Layout components
│   ├── chat/                   # Chat interface
│   └── ui/                     # UI components
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities & services
│   ├── supabase/              # Supabase integration
│   └── mock-data.ts           # Development data
└── types/                      # TypeScript definitions
```

## User Roles & Permissions

### 1. User (Regular Employee)
**Access Level**: Team-scoped
**Navigation Items**:
- My GPT Tools (dashboard/user)
- My Chats (dashboard/user/chats)
- My Projects (dashboard/user/projects)
- Prompt Library (dashboard/user/prompts)
- Team Documents (dashboard/user/documents)
- Settings (dashboard/user/settings)

**Capabilities**:
- Use assigned GPTs for conversations
- View personal chat history
- Access team documents
- Use shared prompt templates
- Manage personal projects

### 2. Admin (Team Manager)
**Access Level**: Team management
**Navigation Items**:
- Team Dashboard (dashboard/admin)
- Team GPTs (dashboard/admin/gpts)
- Team Members (dashboard/admin/members)
- Chat Logs (dashboard/admin/logs)
- Documents (dashboard/admin/documents)
- Prompt Templates (dashboard/admin/templates)
- Settings (dashboard/admin/settings)

**Capabilities**:
- All user capabilities
- Create and manage team GPTs
- Invite and manage team members
- View team chat logs and analytics
- Manage team documents and templates
- Monitor team usage and costs

### 3. Super Admin (System Administrator)
**Access Level**: Organization-wide
**Navigation Items**:
- System Overview (dashboard/super)
- All GPTs (dashboard/super/gpts)
- User Management (dashboard/super/users)
- Teams & Units (dashboard/super/teams)
- Document Library (dashboard/super/documents)
- Prompt Library (dashboard/super/prompts)
- Chat History (dashboard/super/chats)
- System Settings (dashboard/super/settings)
- Security (dashboard/super/security)

**Capabilities**:
- All admin capabilities across all teams
- Approve/reject GPT creations
- Manage organization-wide settings
- View system-wide analytics
- Manage security policies
- Control access levels and permissions

## Page-by-Page Analysis

### Authentication Pages

#### Login Page (`app/login/page.tsx`)
**Purpose**: User authentication with demo accounts
**Key Features**:
- Email/password form
- Demo account selection (3 predefined roles)
- Role-based redirect after login
- Loading states and error handling

**Demo Accounts**:
```typescript
const demoAccounts = [
  { name: "Super Admin", email: "superadmin@test.com", role: "SUPER_ADMIN" },
  { name: "Finance Admin", email: "admin@test.com", role: "ADMIN" },
  { name: "John Doe", email: "user@test.com", role: "USER" }
]
```

**Backend Requirements**:
- Validate credentials
- Return user profile with role and team information
- Support session management

### User Dashboard Pages

#### User Home (`app/dashboard/user/page.tsx`)
**Purpose**: Personal dashboard with overview and quick actions
**Key Components**:
- **Statistics Cards**: Projects (3), Documents (24), Chat Sessions (12), Team Members (8)
- **Recent Items**: Last 3 projects, documents, and chats
- **Activity Progress**: Weekly productivity metrics with progress bars
- **Quick Actions**: Create project, start chat, upload document

**Data Requirements**:
```typescript
interface UserDashboardData {
  stats: {
    activeProjects: number
    documents: number
    chatSessions: number
    teamMembers: number
  }
  recentProjects: Project[]
  recentDocuments: Document[]
  recentChats: ChatSession[]
  weeklyActivity: {
    projectsWorked: { current: number, target: number }
    documentsCreated: { current: number, target: number }
    chatSessions: { current: number, target: number }
  }
}
```

#### User Chats (`app/dashboard/user/chats/page.tsx`)
**Purpose**: Personal chat history management
**Key Features**:
- **Search & Filter**: By title, GPT name, status (all/active/completed)
- **Chat Table**: Title, GPT used, message count, status, dates
- **Action Menu**: Continue chat, save to project, export, delete

**Table Columns**:
- Chat Title (with link to session)
- GPT Used (with icon)
- Messages count
- Status badge (Active/Completed/Archived)
- Created date
- Last updated date
- Actions dropdown

#### Chat Interface (`app/dashboard/user/chats/[gptId]/page.tsx`)
**Purpose**: Real-time chat with specific GPT
**Key Features**:
- **Message Display**: User and AI messages with timestamps
- **Streaming Response**: Real-time AI responses with loading animation
- **Message Input**: Text input with send button
- **Session Management**: Continue existing or start new chat

**Chat Interface Component** (`components/chat/chat-interface.tsx`):
- Message bubbles with role-based styling
- Auto-scroll to latest message
- Loading states with animated dots
- Session context preservation

#### User Documents (`app/dashboard/user/documents/page.tsx`)
**Purpose**: Access team and organization documents
**Key Features**:
- **Search & Filter**: By name, description, category, access level
- **Document Table**: Name, category, access level, size, uploader, date
- **File Types**: PDF, Word, Excel, PowerPoint with appropriate icons
- **Actions**: Preview, download, use in chat

**Document Data Structure**:
```typescript
interface Document {
  id: string
  name: string
  type: "PDF" | "Word" | "Excel" | "PowerPoint"
  size: string
  uploaded_by: string
  uploaded_at: string
  access_level: "Team" | "Organization"
  category: string
  description: string
}
```

### Admin Dashboard Pages

#### Admin Home (`app/dashboard/admin/page.tsx`)
**Purpose**: Team management dashboard
**Key Features**:
- **Team Metrics**: GPTs created (4), Active users (15), Prompts this month (327), Avg response time (4.2s)
- **Quick Actions**: Create GPT, invite member, view chat logs, upload document, manage templates

#### Admin GPTs (`app/dashboard/admin/gpts/page.tsx`)
**Purpose**: Team GPT management
**Key Features**:
- **Search & Filter**: By name with real-time filtering
- **GPT Table**: ID, name, description, team, created date
- **Actions Menu**: View details, open chat, edit GPT, delete
- **Create Button**: Link to new GPT creation

**API Integration**:
```typescript
// Fetches GPTs from /api/gpts endpoint
useEffect(() => {
  const fetchGpts = async () => {
    const response = await fetch("/api/gpts")
    const data = await response.json()
    setGpts(data)
  }
  fetchGpts()
}, [])
```

#### Admin Members (`app/dashboard/admin/members/page.tsx`)
**Purpose**: Team member management
**Key Features**:
- **Team Stats**: Total members, active users, total chats, avg productivity
- **Search & Filter**: By name, email, status
- **Member Table**: Profile, status, activity, productivity score, favorite GPT, join date
- **Invite Dialog**: Email input, role selection (User/Admin)
- **Actions Menu**: Edit profile, view chats, view analytics, manage permissions, remove member

**Member Data Structure**:
```typescript
interface TeamMember {
  id: string
  full_name: string
  email: string
  role: "user" | "admin"
  status: "active" | "inactive" | "suspended"
  last_active: string
  joined_date: string
  chat_count: number
  gpt_usage: number
  favorite_gpt: string
  productivity_score: number
}
```

#### Admin Chat Logs (`app/dashboard/admin/logs/page.tsx`)
**Purpose**: Team chat monitoring and analytics
**Key Features**:
- **Usage Stats**: Total chats, active sessions, tokens used, total cost
- **Advanced Filters**: GPT type, status, date range (1d/7d/30d/90d)
- **Export Functionality**: Download chat logs
- **Detailed Table**: User & chat, GPT used, activity metrics, usage data, status, date
- **Actions**: View chat, export chat, view analytics

**Chat Log Data Structure**:
```typescript
interface ChatLog {
  id: string
  user_name: string
  user_email: string
  gpt_name: string
  chat_title: string
  message_count: number
  duration: string
  created_at: string
  status: "completed" | "active" | "error"
  tokens_used: number
  cost: number
}
```

### Super Admin Dashboard Pages

#### Super Admin Home (`app/dashboard/super/page.tsx`)
**Purpose**: System-wide overview and monitoring
**Key Features**:
- **Global Stats**: Active users (189), GPTs created (47), Prompts 30d (4,231), Documents (582)
- **System Status**: API status, database health, processing queues, storage usage, backup status, error rate

#### Super Admin GPTs (`app/dashboard/super/gpts/page.tsx`)
**Purpose**: Organization-wide GPT management and approval
**Key Features**:
- **System Overview**: Total GPTs, pending approvals, high risk GPTs, monthly cost
- **Advanced Filtering**: Team, status, approval status
- **Bulk Actions**: Select multiple GPTs for bulk approve/suspend/delete
- **Approval Workflow**: Approve/reject GPTs with notes
- **Risk Management**: Risk levels (low/medium/high) with compliance scores
- **Detailed Table**: GPT & team info, status badges, usage & cost metrics, risk & compliance, creation details

**GPT Data Structure (Extended)**:
```typescript
interface GPT {
  id: string
  name: string
  description: string
  team_name: string
  team_id: string
  created_by: string
  status: "active" | "pending" | "suspended" | "inactive"
  approval_status: "approved" | "pending" | "rejected"
  created_at: string
  updated_at: string
  usage_count: number
  active_users: number
  web_access: boolean
  access_level: "team" | "organization"
  model: "GPT-4" | "GPT-3.5"
  monthly_cost: number
  compliance_score: number
  risk_level: "low" | "medium" | "high"
}
```

## Component Architecture

### Layout Components

#### Dashboard Layout (`components/layout/dashboard-layout.tsx`)
**Purpose**: Main layout wrapper for all dashboard pages
**Props**:
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  title?: string
  description?: string
}
```

#### Top Navigation (`components/layout/top-navigation.tsx`)
**Key Features**:
- **Brand Logo**: GPTWorkDesk with brain icon
- **Global Search**: Search GPTs, chats, documents
- **Notifications**: Bell icon with red dot (admin/super admin only)
- **User Profile Dropdown**: 
  - User info with avatar, name, email
  - Role badge (User/Admin/Super Admin)
  - Profile, Settings, Sign out options

#### Sidebar Navigation (`components/layout/sidebar-navigation.tsx`)
**Key Features**:
- **Collapsible**: Toggle between expanded/collapsed states
- **Dynamic Items**: Based on user role
- **Active State**: Highlights current page
- **Icons & Descriptions**: Each item has icon and description

### UI Components

#### Demo Account Item (`components/ui/demo-account-item.tsx`)
**Purpose**: Login page demo account selection
**Features**:
- Role-specific icons (Crown, Shield, User)
- Color-coded badges
- Click handler for auto-fill

#### Chat Interface (`components/chat/chat-interface.tsx`)
**Key Features**:
- **Message Rendering**: User and AI messages with different styling
- **Streaming Support**: Real-time message streaming
- **Auto-scroll**: Automatically scrolls to latest message
- **Loading Animation**: Typing indicator with bouncing dots
- **Session Management**: Handles existing and new chat sessions

**Props Interface**:
```typescript
interface ChatInterfaceProps {
  gptName: string
  gptDescription: string
  initialMessages?: ChatMessage[]
  sessionId?: string
  onSendMessage?: (message: string) => void
  onNewChat?: () => void
}
```

## Data Models & Types

### Core Types (`types/index.ts`)

```typescript
export interface User {
  id: string
  email: string
  full_name: string
  role: "user" | "admin" | "super_admin"
  team_id: string
  team_name: string
  avatar?: string
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
```

### Mock Data Structure (`lib/mock-data.ts`)

The application uses comprehensive mock data for development:
- **Users**: 5 users across different teams and roles
- **GPTs**: 5 GPTs with various configurations and statuses
- **Projects**: 3 projects with different statuses
- **Documents**: 3 documents with different types
- **Templates**: 2 prompt templates
- **Chat Sessions**: 5 sessions with different GPTs and users
- **Chat Messages**: Sample conversation data
- **Teams**: 3 teams with different purposes

## API Integration Points

### Current API Routes

#### Chat API (`app/api/chat/route.ts`)
**Purpose**: Handle streaming chat responses
**Method**: POST
**Payload**:
```typescript
{
  messages: Message[]
  sessionId?: string
  gptName: string
}
```

#### GPTs API (`app/api/gpts/route.ts`)
**Methods**: GET, POST
**Features**:
- List all GPTs
- Create new GPT
- Mock data integration

#### GPT Detail API (`app/api/gpts/[id]/route.ts`)
**Methods**: GET, DELETE, PUT
**Features**:
- Get specific GPT
- Update GPT
- Delete GPT

### Supabase Integration Points

#### New API Structure (`app/api/supabase/`)
- **GPTs**: `/api/supabase/gpts`
- **Chat Sessions**: `/api/supabase/chat/sessions`
- **Users**: `/api/supabase/users`
- **Documents**: `/api/supabase/documents`
- **Templates**: `/api/supabase/templates`
- **Analytics**: `/api/supabase/analytics`

## Authentication & Authorization

### Current Authentication (`hooks/use-auth.tsx`)
**Features**:
- Mock authentication with localStorage
- Role-based access control
- Session management
- Login/logout functionality

**Demo Credentials**:
- All accounts use password: "password123"
- Email-based role assignment

### Supabase Authentication (`hooks/use-supabase-auth.tsx`)
**Enhanced Features**:
- Real authentication with Supabase Auth
- Profile management
- Team-based access control
- Permission checking utilities

### Permission System
```typescript
export function usePermissions() {
  const { user } = useSupabaseAuth()
  
  return {
    isUser: user?.role === 'user',
    isAdmin: user?.role === 'admin',
    isSuperAdmin: user?.role === 'super_admin',
    canManageTeam: isAdminOrSuper,
    canManageUsers: isAdminOrSuper,
    canViewAnalytics: isAdminOrSuper,
    // ... more permissions
  }
}
```

## UI Interactions & Features

### Search & Filtering
**Global Search** (Top Navigation):
- Placeholder: "Search GPTs, chats, documents..."
- Searches across all accessible content

**Page-Specific Filters**:
- **GPTs**: By name, description, team
- **Chats**: By title, GPT name, status
- **Documents**: By name, description, category, access level
- **Members**: By name, email, status
- **Logs**: By user, chat title, GPT name, status, date range

### Table Interactions
**Common Patterns**:
- **Hover Effects**: Row highlighting on hover
- **Action Menus**: Three-dot dropdown menus
- **Status Badges**: Color-coded status indicators
- **Sorting**: Clickable column headers
- **Pagination**: For large datasets

**Action Menu Items** (varies by context):
- View Details / View Chat
- Edit / Edit Profile
- Continue Chat / Open Chat
- Export / Download
- View Analytics
- Manage Permissions
- Delete / Remove

### Form Interactions
**Common Patterns**:
- **Real-time Validation**: Immediate feedback
- **Loading States**: Disabled buttons with spinners
- **Error Handling**: Toast notifications
- **Auto-fill**: Demo account selection

### Modal Dialogs
**Invite Member Dialog**:
- Email input with validation
- Role selection dropdown
- Cancel/Send invitation buttons

**Approval Dialog** (Super Admin):
- Approve/Reject actions
- Notes textarea
- Confirmation buttons

## Backend Integration Requirements

### Database Schema Requirements

#### Users Table
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- full_name (String)
- role (Enum: user, admin, super_admin)
- team_id (UUID, Foreign Key)
- avatar_url (String, Optional)
- status (String: active, inactive, suspended)
- last_active (Timestamp)
- created_at (Timestamp)
- updated_at (Timestamp)
- preferences (JSON)
```

#### GPTs Table
```sql
- id (UUID, Primary Key)
- name (String)
- description (Text)
- category (String)
- status (Enum: active, inactive, pending, suspended)
- creator_id (UUID, Foreign Key to Users)
- team_id (UUID, Foreign Key to Teams)
- prompt (Text)
- model (String: GPT-4, GPT-3.5)
- temperature (Decimal)
- max_tokens (Integer)
- usage_count (Integer)
- rating (Decimal)
- tags (Array)
- is_public (Boolean)
- web_access (Boolean)
- approval_status (Enum: approved, pending, rejected)
- risk_level (Enum: low, medium, high)
- access_level (Enum: team, organization)
- compliance_score (Integer)
- monthly_cost (Decimal)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Chat Sessions Table
```sql
- id (UUID, Primary Key)
- title (String)
- user_id (UUID, Foreign Key)
- gpt_id (UUID, Foreign Key)
- status (Enum: active, completed, archived)
- created_at (Timestamp)
- updated_at (Timestamp)
- message_count (Integer)
- context (JSON)
```

#### Chat Messages Table
```sql
- id (UUID, Primary Key)
- session_id (UUID, Foreign Key)
- sender (Enum: user, gpt)
- content (Text)
- created_at (Timestamp)
- metadata (JSON)
- tokens_used (Integer)
- response_time_ms (Integer)
```

### API Endpoints Required

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update current user

#### GPTs Management
- `GET /api/gpts` - List GPTs (with role-based filtering)
- `POST /api/gpts` - Create new GPT
- `GET /api/gpts/:id` - Get GPT details
- `PUT /api/gpts/:id` - Update GPT
- `DELETE /api/gpts/:id` - Delete GPT
- `POST /api/gpts/:id/approve` - Approve GPT (Super Admin)
- `POST /api/gpts/:id/reject` - Reject GPT (Super Admin)

#### Chat Management
- `GET /api/chats` - List chat sessions
- `POST /api/chats` - Create new chat session
- `GET /api/chats/:id` - Get chat session with messages
- `PUT /api/chats/:id` - Update chat session
- `DELETE /api/chats/:id` - Delete chat session
- `POST /api/chats/:id/messages` - Add message to session
- `POST /api/chat/stream` - Stream chat responses

#### User Management
- `GET /api/users` - List users (Admin/Super Admin)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `POST /api/users/invite` - Invite new user
- `DELETE /api/users/:id` - Remove user

#### Documents
- `GET /api/documents` - List accessible documents
- `POST /api/documents` - Upload document
- `GET /api/documents/:id` - Get document
- `DELETE /api/documents/:id` - Delete document

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/usage` - Usage statistics
- `GET /api/analytics/costs` - Cost analysis
- `GET /api/analytics/logs` - Audit logs

### Real-time Requirements
- **Chat Streaming**: WebSocket or Server-Sent Events for real-time chat
- **Notifications**: Real-time notifications for admins
- **Status Updates**: Live status updates for GPT approvals

### Security Requirements
- **Role-Based Access Control**: Enforce permissions at API level
- **Team Isolation**: Users can only access their team's data
- **Audit Logging**: Log all significant actions
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Validate all inputs
- **CORS Configuration**: Proper cross-origin setup

### Performance Requirements
- **Pagination**: All list endpoints should support pagination
- **Caching**: Cache frequently accessed data
- **Search Optimization**: Efficient search across large datasets
- **File Upload**: Handle large document uploads
- **Response Times**: Keep API responses under 200ms for data queries

This architecture document provides a complete blueprint for backend engineers to understand the frontend requirements and implement the necessary backend services to support the GPT Desk application.