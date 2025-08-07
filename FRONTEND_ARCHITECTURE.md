# GPT Desk - Frontend Architecture Documentation

This document provides a comprehensive breakdown of the GPT Desk frontend architecture, detailing every page, component, feature, and functionality across all user roles and screens.

## Table of Contents

1. [Application Overview](#application-overview)
2. [Technology Stack & Dependencies](#technology-stack--dependencies)
3. [Project Structure](#project-structure)
4. [Global Components & Layout](#global-components--layout)
5. [Authentication System](#authentication-system)
6. [User Role Dashboards](#user-role-dashboards)
7. [Shared Components](#shared-components)
8. [State Management](#state-management)
9. [Styling & Design System](#styling--design-system)
10. [Data Flow & API Integration](#data-flow--api-integration)

## Application Overview

GPT Desk is a multi-tenant AI assistant management platform built with Next.js 14 and React 19. The application serves three distinct user roles with role-based access control and features real-time chat, document management, analytics, and team collaboration.

### Core Features
- **Multi-Role Dashboard System**: User, Admin, Super Admin interfaces
- **Real-Time Chat Interface**: Streaming AI conversations
- **GPT Management**: Create, configure, and deploy custom AI assistants
- **Document Management**: Upload, share, and organize team documents
- **Analytics & Monitoring**: Usage tracking, cost analysis, performance metrics
- **Team Management**: User invitations, role management, activity monitoring
- **Template System**: Reusable prompt templates
- **Audit Logging**: Complete activity tracking

## Technology Stack & Dependencies

### Core Framework
```json
{
  "next": "14.x",
  "react": "19.x",
  "typescript": "5.x"
}
```

### UI & Styling
```json
{
  "tailwindcss": "3.x",
  "@radix-ui/react-*": "Latest",
  "lucide-react": "Latest",
  "clsx": "Latest",
  "tailwind-merge": "Latest"
}
```

### State & Data Management
```json
{
  "ai": "Latest",
  "@supabase/supabase-js": "Latest",
  "@supabase/auth-helpers-nextjs": "Latest"
}
```

## Project Structure

```
app/
├── (auth)/
│   └── login/                    # Authentication pages
├── dashboard/
│   ├── user/                     # User role pages
│   ├── admin/                    # Admin role pages
│   └── super/                    # Super admin pages
├── api/                          # API routes
├── globals.css                   # Global styles
├── layout.tsx                    # Root layout
└── page.tsx                      # Root redirect

components/
├── layout/                       # Layout components
├── chat/                         # Chat-specific components
└── ui/                          # Reusable UI components

hooks/                           # Custom React hooks
lib/                            # Utilities and services
types/                          # TypeScript definitions
```

## Global Components & Layout

### Root Layout (`app/layout.tsx`)

**Purpose**: Application-wide layout wrapper with providers
**Components**:
- `ThemeProvider`: Theme management (light mode)
- `AuthProvider`: Authentication context
- Font configuration (Inter)

**Features**:
- Global metadata configuration
- Provider composition
- Font optimization

```typescript
interface RootLayoutProps {
  children: React.ReactNode
}

// Metadata
title: "GPTWorkDesk - Internal AI Assistant"
description: "Workforce Group Organization's Internal Intelligence Assistant"
```

### Root Page (`app/page.tsx`)

**Purpose**: Role-based routing and authentication check
**Functionality**:
- Authentication state detection
- Role-based redirection:
  - `super_admin` → `/dashboard/super`
  - `admin` → `/dashboard/admin`
  - `user` → `/dashboard/user`
  - Unauthenticated → `/login`

**Components**:
- Loading spinner during authentication check
- Automatic redirection logic

### Middleware (`middleware.ts`)

**Purpose**: Request interception and routing protection
**Current State**: Placeholder for future authentication checks
**Future Features**:
- Route protection based on user roles
- Authentication token validation
- Redirect handling

## Authentication System

### Login Page (`app/login/page.tsx`)

**Purpose**: User authentication with demo account support
**Layout**: Centered card on gradient background

#### Components & Features

**Main Form**:
- **Email Input**: 
  - Type: email
  - Placeholder: "Select a demo account below"
  - Required validation
- **Password Input**: 
  - Type: password
  - Placeholder: "Any password works"
  - Required validation
- **Submit Button**: 
  - Loading state with spinner
  - Disabled during submission
  - Green primary styling

**Demo Accounts Section**:
- **Divider**: "DEMO ACCOUNTS" separator
- **Account Cards**: 3 predefined demo accounts

#### Demo Account Data Structure
```typescript
interface DemoAccount {
  name: string
  email: string
  role: "SUPER_ADMIN" | "ADMIN" | "USER"
  team: string
}

const demoAccounts = [
  {
    name: "Super Admin",
    email: "superadmin@test.com", 
    role: "SUPER_ADMIN",
    team: "Executive Management"
  },
  {
    name: "Finance Admin",
    email: "admin@test.com",
    role: "ADMIN", 
    team: "Finance Team"
  },
  {
    name: "John Doe",
    email: "user@test.com",
    role: "USER",
    team: "Finance Team"
  }
]
```

#### Demo Account Item Component (`components/ui/demo-account-item.tsx`)

**Purpose**: Individual demo account selection card
**Features**:
- **Role Icons**:
  - Super Admin: Crown (yellow)
  - Admin: Shield (blue)
  - User: User (gray)
- **Information Display**:
  - Name (primary text)
  - Email (blue link text)
  - Team (gray secondary text)
- **Role Badge**: Color-coded role indicator
- **Click Handler**: Auto-fills login form

**Styling**:
- Hover effects with background change
- Rounded border card design
- Responsive layout

#### Authentication Flow
1. User selects demo account or enters credentials
2. Form validation on submit
3. Loading state with spinner
4. Success: Role-based redirect
5. Error: Display error message

## User Role Dashboards

### User Dashboard (`/dashboard/user`)

#### User Home Page (`app/dashboard/user/page.tsx`)

**Purpose**: Personal productivity dashboard and overview
**Layout**: Grid-based layout with cards and quick actions

##### Navigation Items
```typescript
const navigationItems = [
  {
    name: "My GPT Tools",
    href: "/dashboard/user",
    icon: Brain,
    description: "Access your assigned GPTs"
  },
  {
    name: "My Chats", 
    href: "/dashboard/user/chats",
    icon: MessageSquare,
    description: "Chat history & sessions"
  },
  {
    name: "My Projects",
    href: "/dashboard/user/projects", 
    icon: FolderOpen,
    description: "Organized chat folders"
  },
  {
    name: "Prompt Library",
    href: "/dashboard/user/prompts",
    icon: BookOpen, 
    description: "Saved prompt templates"
  },
  {
    name: "Team Documents",
    href: "/dashboard/user/documents",
    icon: FileText,
    description: "Shared team resources"
  },
  {
    name: "Settings",
    href: "/dashboard/user/settings",
    icon: Settings,
    description: "Profile & preferences"
  }
]
```

##### Statistics Cards (4-column grid)
**Data Structure**:
```typescript
interface StatCard {
  title: string
  value: string
  change: string
  icon: LucideIcon
  color: string
}

const stats = [
  {
    title: "Active Projects",
    value: "3", 
    change: "+2 this week",
    icon: FolderOpen,
    color: "text-blue-600"
  },
  {
    title: "Documents",
    value: "24",
    change: "+5 this week", 
    icon: FileText,
    color: "text-green-600"
  },
  {
    title: "Chat Sessions",
    value: "12",
    change: "+3 this week",
    icon: MessageSquare,
    color: "text-purple-600"
  },
  {
    title: "Team Members", 
    value: "8",
    change: "No change",
    icon: Users,
    color: "text-orange-600"
  }
]
```

##### Main Content Grid (3-column layout)

**Recent Projects Card**:
- **Header**: Title with FolderOpen icon
- **Content**: List of last 3 projects
- **Project Item Structure**:
  - Name (truncated)
  - Description (truncated)
  - Status badge (Active/Completed)
- **Footer**: "View all projects" link with arrow

**Recent Documents Card**:
- **Header**: Title with FileText icon
- **Content**: List of last 3 documents
- **Document Item Structure**:
  - Name (truncated)
  - Size and type info
  - Clock icon for recency
- **Footer**: "View all documents" link

**Recent Chats Card**:
- **Header**: Title with MessageSquare icon
- **Content**: List of last 3 chat sessions
- **Chat Item Structure**:
  - Bot icon
  - Chat title (truncated)
  - GPT name and message count
  - Date
  - Clickable link to session
- **Footer**: "View all chats" link

##### Activity Overview (2-column grid)

**Weekly Activity Card**:
- **Progress Bars**: 3 progress indicators
  - Projects worked on (3/5 - 60%)
  - Documents created (8/10 - 80%)
  - Chat sessions (12/15 - 80%)
- **Visual**: Progress bars with percentage

**Quick Actions Card**:
- **Action Buttons**: 3 outline buttons
  - Create New Project (FolderOpen icon)
  - Start New Chat (MessageSquare icon)
  - Upload Document (FileText icon)
- **Styling**: Full-width buttons with left-aligned icons

#### User Chats Page (`app/dashboard/user/chats/page.tsx`)

**Purpose**: Personal chat history management and continuation
**Layout**: Search/filter section + data table

##### Search and Filters Card
**Search Input**:
- **Icon**: Search icon (left-positioned)
- **Placeholder**: "Search chats by title or GPT name..."
- **Functionality**: Real-time filtering
- **Styling**: Focus states with green accent

**Filter Buttons**:
- **All**: Default active state
- **Active**: Filter active chats
- **Completed**: Filter completed chats
- **Styling**: Toggle between default/outline variants

##### Chat History Table
**Table Structure**:
```typescript
interface ChatTableRow {
  chatTitle: {
    icon: MessageSquare (in colored circle)
    title: string (clickable link)
  }
  gptUsed: {
    icon: Brain
    name: string
  }
  messages: string (count + "messages")
  status: Badge (Active/Completed/Archived)
  created: {
    icon: Calendar
    date: formatted string
  }
  lastUpdated: {
    icon: Clock  
    date: formatted string
  }
  actions: DropdownMenu
}
```

**Actions Dropdown Menu**:
- **Continue Chat**: Eye icon + link to session
- **Save to Project**: Organization action
- **Export**: Download functionality
- **Delete**: Destructive action (red text)

**Empty State**:
- MessageSquare icon (large, gray)
- "No chats found matching your criteria" message

##### Data Processing
```typescript
const filteredChats = userChats.filter((chat) => {
  const matchesSearch = 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.gpt_name.toLowerCase().includes(searchQuery.toLowerCase())
  const matchesStatus = filterStatus === "all" || chat.status === filterStatus
  return matchesSearch && matchesStatus
})
```

#### User Chat Interface (`app/dashboard/user/chats/[gptId]/page.tsx`)

**Purpose**: Real-time conversation with specific GPT assistant
**Layout**: Full-height chat interface

##### Chat Interface Component Integration
- **GPT Information**: Retrieved from mock data by ID
- **Session Management**: Latest session for user-GPT combination
- **Message History**: Pre-loaded from existing sessions
- **Height**: `calc(100vh-160px)` for optimal viewing

##### Error Handling
- **Not Found**: Automatic 404 redirect for invalid GPT IDs
- **Session Filtering**: User-specific session isolation
- **Message Loading**: Chronological message ordering

#### User Documents Page (`app/dashboard/user/documents/page.tsx`)

**Purpose**: Access team and organization-wide document library
**Layout**: Search/filter section + document table

##### Search and Filters Card
**Search Input**:
- **Placeholder**: "Search documents by name, description, or category..."
- **Icon**: Search icon positioning
- **Functionality**: Multi-field search

**Filter Dropdowns**:
- **Category Filter**: 
  - Options: All Categories, Strategy, Legal, HR, Finance, Process
  - Dynamic population from document data
- **Access Level Filter**:
  - Options: All Access Levels, Team, Organization
  - Controls visibility scope

##### Document Table Structure
```typescript
interface DocumentTableRow {
  document: {
    icon: string (emoji based on file type)
    name: string
    description: string (gray text)
  }
  category: Badge (secondary variant)
  accessLevel: Badge (Team: green, Organization: blue)
  size: string
  uploadedBy: {
    icon: User
    name: string
  }
  uploadDate: {
    icon: Calendar
    date: formatted string
  }
  actions: DropdownMenu
}
```

**File Type Icons**:
```typescript
const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf": return "📄"
    case "word": return "📝" 
    case "excel": return "📊"
    case "powerpoint": return "📋"
    default: return "📄"
  }
}
```

**Actions Dropdown**:
- **Preview**: Eye icon - document preview
- **Download**: Download icon - file download
- **Use in Chat**: MessageSquare icon - integrate with chat

**Empty State**:
- FileText icon (large, gray)
- "No documents found matching your criteria"

### Admin Dashboard (`/dashboard/admin`)

#### Admin Home Page (`app/dashboard/admin/page.tsx`)

**Purpose**: Team management dashboard with metrics and quick actions
**Layout**: Metrics grid + quick actions card

##### Navigation Items
```typescript
const navigationItems = [
  {
    name: "Team Dashboard",
    href: "/dashboard/admin", 
    icon: BarChart3,
    description: "Team overview & metrics"
  },
  {
    name: "Team GPTs",
    href: "/dashboard/admin/gpts",
    icon: Brain,
    description: "Manage team AI assistants"
  },
  {
    name: "Team Members", 
    href: "/dashboard/admin/members",
    icon: Users,
    description: "User management & activity"
  },
  {
    name: "Chat Logs",
    href: "/dashboard/admin/logs", 
    icon: MessageSquare,
    description: "Team conversation history"
  },
  {
    name: "My Chats",
    href: "/dashboard/admin/chats",
    icon: MessageSquare,
    description: "My personal chat history"
  },
  {
    name: "Documents",
    href: "/dashboard/admin/documents",
    icon: FileText,
    description: "Team document library"
  },
  {
    name: "Prompt Templates",
    href: "/dashboard/admin/templates",
    icon: BookOpen, 
    description: "Team prompt library"
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    description: "Team configuration"
  }
]
```

##### Team Metrics (4-column grid)
```typescript
const metrics = [
  {
    icon: Brain,
    value: "4",
    label: "GPTs Created",
    color: "text-[#66BB6A]"
  },
  {
    icon: Users, 
    value: "15",
    label: "Active Users",
    color: "text-[#66BB6A]"
  },
  {
    icon: MessageSquare,
    value: "327", 
    label: "Prompts This Month",
    color: "text-[#66BB6A]"
  },
  {
    icon: BarChart3,
    value: "4.2s",
    label: "Avg Response Time", 
    color: "text-[#66BB6A]"
  }
]
```

##### Quick Actions Card (5-column grid)
```typescript
const quickActions = [
  {
    icon: Plus,
    label: "Create New GPT",
    href: "/dashboard/admin/gpts/new"
  },
  {
    icon: UserPlus,
    label: "Invite New Member", 
    href: "/dashboard/admin/members/invite"
  },
  {
    icon: MessageSquare,
    label: "View Chat Logs",
    href: "/dashboard/admin/logs"
  },
  {
    icon: Upload,
    label: "Upload Document",
    href: "/dashboard/admin/documents/upload"
  },
  {
    icon: LayoutTemplate,
    label: "Manage Templates",
    href: "/dashboard/admin/templates"
  }
]
```

**Action Button Styling**:
- Outline variant with transparent background
- Vertical layout (icon above text)
- Green accent color for icons
- Hover effects

#### Admin GPTs Page (`app/dashboard/admin/gpts/page.tsx`)

**Purpose**: Team GPT management with CRUD operations
**Layout**: Header with search + create button + data table

##### Header Section
**Search Input**:
- **Icon**: Search icon (left-positioned)
- **Placeholder**: "Search GPTs..."
- **Styling**: Focus states with green accent

**Create Button**:
- **Text**: "Create New GPT"
- **Icon**: Plus icon
- **Styling**: Primary button with shadow effects
- **Link**: Routes to `/dashboard/admin/gpts/new`

##### GPT Table Structure
```typescript
interface GPTTableRow {
  id: string
  name: string
  description: string
  team: string
  createdAt: formatted date
  actions: DropdownMenu
}
```

**Actions Dropdown**:
- **View Details**: Eye icon
- **Open Chat**: MessageSquare icon + link
- **Edit GPT**: Settings icon + link
- **Edit** (duplicate): Edit action
- **Delete**: Destructive action with confirmation

##### API Integration
```typescript
useEffect(() => {
  const fetchGpts = async () => {
    try {
      const response = await fetch("/api/gpts", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      const data = await response.json()
      setGpts(data)
    } catch (error) {
      toast({
        title: "Error fetching GPTs",
        description: error.message,
        variant: "destructive"
      })
    }
  }
  fetchGpts()
}, [toast])
```

**Delete Functionality**:
```typescript
const handleDelete = async (gptId: string) => {
  try {
    const response = await fetch(`/api/gpts/${gptId}`, {
      method: "DELETE"
    })
    if (response.ok) {
      setGpts(prevGpts => prevGpts.filter(g => g.id !== gptId))
      toast({
        title: "GPT deleted",
        description: "GPT has been deleted successfully"
      })
    }
  } catch (error) {
    toast({
      title: "Error deleting GPT", 
      description: error.message,
      variant: "destructive"
    })
  }
}
```

#### Admin Members Page (`app/dashboard/admin/members/page.tsx`)

**Purpose**: Team member management with invitation and monitoring
**Layout**: Stats grid + search/invite section + members table

##### Team Statistics (4-column grid)
```typescript
const teamStats = [
  {
    icon: Users,
    value: mockTeamMembers.length,
    label: "Total Members"
  },
  {
    icon: Activity,
    value: mockTeamMembers.filter(m => m.status === "active").length,
    label: "Active Users"
  },
  {
    icon: MessageSquare, 
    value: mockTeamMembers.reduce((sum, member) => sum + member.chat_count, 0),
    label: "Total Chats"
  },
  {
    icon: BarChart3,
    value: Math.round(avgProductivity) + "%",
    label: "Avg Productivity"
  }
]
```

##### Search and Invite Section
**Search Input**:
- **Placeholder**: "Search members by name or email..."
- **Icon**: Search icon positioning
- **Real-time filtering**: Updates table immediately

**Status Filter Dropdown**:
- Options: All Status, Active, Inactive, Suspended
- Affects table filtering

**Invite Member Dialog**:
- **Trigger**: "Invite Member" button with UserPlus icon
- **Form Fields**:
  - Email input (required, email validation)
  - Role dropdown (User/Admin options)
- **Actions**: Cancel, Send Invitation (with Mail icon)

##### Members Table Structure
```typescript
interface MemberTableRow {
  member: {
    avatar: AvatarFallback (initials)
    name: string
    email: string (gray text)
  }
  status: Badge (Active: green, Inactive: gray, Suspended: red)
  activity: {
    chatCount: number + " chats"
    lastActive: formatted relative time
  }
  productivity: {
    progressBar: visual progress bar
    percentage: colored percentage text
  }
  favoriteGPT: {
    icon: Brain
    name: string
  }
  joined: {
    icon: Calendar
    date: formatted date
  }
  actions: DropdownMenu
}
```

**Productivity Color Coding**:
```typescript
const getProductivityColor = (score: number) => {
  if (score >= 90) return "text-green-600"
  if (score >= 75) return "text-blue-600" 
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}
```

**Actions Dropdown**:
- **Edit Profile**: Edit icon
- **View Chats**: MessageSquare icon
- **View Analytics**: BarChart3 icon
- **Manage Permissions**: Shield icon
- **Remove Member**: Trash2 icon (destructive, red text)

##### Member Data Structure
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

#### Admin Chat Logs Page (`app/dashboard/admin/logs/page.tsx`)

**Purpose**: Team chat monitoring, analytics, and audit trail
**Layout**: Usage stats + filters + detailed logs table

##### Usage Statistics (4-column grid)
```typescript
const usageStats = [
  {
    icon: MessageSquare,
    value: mockChatLogs.length,
    label: "Total Chats"
  },
  {
    icon: Clock,
    value: mockChatLogs.filter(log => log.status === "active").length,
    label: "Active Sessions"
  },
  {
    icon: BarChart3,
    value: totalTokens.toLocaleString(),
    label: "Tokens Used"
  },
  {
    icon: FileText,
    value: "$" + totalCost.toFixed(2),
    label: "Total Cost"
  }
]
```

##### Advanced Filters Section
**Search Input**:
- **Placeholder**: "Search by user, chat title, or GPT name..."
- **Multi-field search**: Searches across user names, chat titles, GPT names

**Filter Dropdowns**:
- **GPT Filter**: Dynamically populated from unique GPTs in logs
- **Status Filter**: All Status, Completed, Active, Error
- **Date Range**: Last 24 hours, 7 days, 30 days, 90 days

**Export Button**:
- **Icon**: Download icon
- **Functionality**: Export filtered logs to CSV/Excel

##### Chat Logs Table Structure
```typescript
interface ChatLogRow {
  userAndChat: {
    avatar: User initials
    chatTitle: string
    userName: string (gray text)
  }
  gptUsed: {
    icon: Brain
    name: string (bold)
  }
  activity: {
    messageCount: number + " messages" (with MessageSquare icon)
    duration: string (with Clock icon)
  }
  usage: {
    tokensUsed: formatted number + " tokens"
    cost: "$" + formatted cost
  }
  status: Badge (Completed: green, Active: blue, Error: red)
  date: {
    icon: Calendar
    date: formatted date/time
  }
  actions: DropdownMenu
}
```

**Actions Dropdown**:
- **View Chat**: Eye icon - opens chat session
- **Export Chat**: Download icon - exports individual chat
- **View Analytics**: BarChart3 icon - detailed analytics

##### Chat Log Data Structure
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

### Super Admin Dashboard (`/dashboard/super`)

#### Super Admin Home Page (`app/dashboard/super/page.tsx`)

**Purpose**: System-wide monitoring and platform health overview
**Layout**: Global stats + system status grid

##### Navigation Items
```typescript
const navigationItems = [
  {
    name: "Overview",
    href: "/dashboard/super",
    icon: BarChart3,
    description: "Org metrics"
  },
  {
    name: "All GPTs", 
    href: "/dashboard/super/gpts",
    icon: Brain,
    description: "Org GPTs"
  },
  {
    name: "User Management",
    href: "/dashboard/super/users",
    icon: Users,
    description: "Users"
  },
  {
    name: "Teams & Units",
    href: "/dashboard/super/teams", 
    icon: Building2,
    description: "Teams"
  },
  {
    name: "Document Library",
    href: "/dashboard/super/documents",
    icon: FileText,
    description: "Docs"
  },
  {
    name: "Prompt Library",
    href: "/dashboard/super/prompts",
    icon: BookOpen,
    description: "Prompts"
  },
  {
    name: "Chat History",
    href: "/dashboard/super/chats",
    icon: MessageSquare, 
    description: "Chat logs"
  },
  {
    name: "System Settings",
    href: "/dashboard/super/settings",
    icon: Settings,
    description: "Settings"
  },
  {
    name: "Security",
    href: "/dashboard/super/security",
    icon: Shield,
    description: "Security"
  }
]
```

##### Global Statistics (4-column grid)
```typescript
const globalStats = [
  {
    icon: Users,
    value: "189",
    label: "Active Users",
    color: "text-[#66BB6A]"
  },
  {
    icon: Brain,
    value: "47", 
    label: "GPTs Created",
    color: "text-[#66BB6A]"
  },
  {
    icon: BarChart3,
    value: "4,231",
    label: "Prompts (30d)",
    color: "text-[#66BB6A]"
  },
  {
    icon: FileText,
    value: "582",
    label: "Documents", 
    color: "text-[#66BB6A]"
  }
]
```

##### System Status Grid (3x2 grid)
```typescript
interface SystemStatusItem {
  label: string
  value: string
  status: "operational" | "warning" | "error"
  indicator: "green" | "yellow" | "red"
}

const systemStatus = [
  {
    label: "API Status",
    value: "Operational", 
    indicator: "green"
  },
  {
    label: "Database",
    value: "Healthy",
    indicator: "green"
  },
  {
    label: "Processing Queues", 
    value: "Normal",
    indicator: "green"
  },
  {
    label: "Storage Usage",
    value: "75%",
    indicator: "yellow"
  },
  {
    label: "Last Backup",
    value: "2 hours ago",
    indicator: "green"
  },
  {
    label: "Error Rate",
    value: "0.01%", 
    indicator: "green"
  }
]
```

**Status Card Styling**:
- Gray background with border
- Status indicator (colored dot)
- Label and value text hierarchy

#### Super Admin GPTs Page (`app/dashboard/super/gpts/page.tsx`)

**Purpose**: Organization-wide GPT management with approval workflow
**Layout**: System overview + filters + bulk actions + detailed table

##### System Overview (4-column grid)
```typescript
const systemOverview = [
  {
    icon: Brain,
    value: mockAllGPTs.length,
    label: "Total GPTs"
  },
  {
    icon: Clock,
    value: pendingApprovals,
    label: "Pending Approval",
    color: "text-yellow-500"
  },
  {
    icon: AlertTriangle,
    value: highRiskGPTs, 
    label: "High Risk",
    color: "text-red-500"
  },
  {
    icon: BarChart3,
    value: "$" + totalCost.toFixed(0),
    label: "Monthly Cost"
  }
]
```

##### Advanced Filtering System
**Search Input**:
- **Placeholder**: "Search GPTs by name, description, or team..."
- **Multi-field search**: Comprehensive search across all GPT fields

**Filter Dropdowns**:
- **Team Filter**: Dynamically populated from unique teams
- **Status Filter**: All Status, Active, Pending, Suspended, Inactive  
- **Approval Filter**: All Approvals, Approved, Pending, Rejected

##### Bulk Actions System
**Selection Mechanism**:
- **Master Checkbox**: Select/deselect all visible GPTs
- **Individual Checkboxes**: Per-row selection
- **Selection Counter**: Shows "X GPTs selected"

**Bulk Action Buttons**:
- **Bulk Approve**: Approve multiple GPTs
- **Bulk Suspend**: Suspend multiple GPTs  
- **Bulk Delete**: Delete multiple GPTs

##### GPT Table Structure (Extended)
```typescript
interface SuperAdminGPTRow {
  selection: Checkbox
  gptAndTeam: {
    icon: Brain (in colored circle)
    name: string
    teamName: string
    orgWideIndicator?: Badge (if organization-wide)
  }
  status: {
    statusBadge: Badge (Active/Pending/Suspended/Inactive)
    approvalBadge: Badge with icon (Approved/Pending/Rejected)
  }
  usageAndCost: {
    activeUsers: number + " users" (with Users icon)
    usageCount: number + " uses" (with TrendingUp icon)  
    monthlyCost: "$" + formatted cost (green text)
  }
  riskAndCompliance: {
    riskBadge: Badge (Low/Medium/High Risk)
    complianceScore: percentage + "Compliance"
  }
  created: {
    date: formatted date
    creator: "by " + creator name (gray text)
  }
  actions: DropdownMenu
}
```

**Status Badge Styling**:
```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case "active": return <Badge className="bg-green-100 text-green-800">Active</Badge>
    case "pending": return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    case "suspended": return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
    case "inactive": return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
  }
}

const getApprovalBadge = (approval: string) => {
  switch (approval) {
    case "approved": return (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />Approved
      </Badge>
    )
    case "pending": return (
      <Badge className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />Pending  
      </Badge>
    )
    case "rejected": return (
      <Badge className="bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />Rejected
      </Badge>
    )
  }
}
```

**Actions Dropdown (Extended)**:
- **View Details**: Eye icon
- **Open Chat**: MessageSquare icon + link
- **Edit GPT**: Edit icon + link  
- **View Analytics**: BarChart3 icon
- **Approve** (if pending): CheckCircle icon
- **Reject** (if pending): XCircle icon
- **Delete**: Trash2 icon (destructive)

##### Approval Dialog Component
**Purpose**: Handle GPT approval/rejection with notes
**Form Fields**:
- **Action Type**: Approve or Reject (determined by trigger)
- **Notes Textarea**: 
  - Approve: "Approval Notes (Optional)"
  - Reject: "Rejection Reason" (required)
- **Actions**: Cancel, Approve GPT / Reject GPT

**Dialog Styling**:
- Approve: Primary button styling
- Reject: Red background with white text

## Shared Components

### Dashboard Layout (`components/layout/dashboard-layout.tsx`)

**Purpose**: Consistent layout wrapper for all dashboard pages
**Structure**: Top navigation + sidebar + main content area

**Props Interface**:
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  title?: string
  description?: string
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}
```

**Layout Structure**:
- **Height**: Full screen (`h-screen`)
- **Flex Direction**: Column
- **Top Navigation**: Fixed height header
- **Content Area**: Flex row with sidebar and main content

### Top Navigation (`components/layout/top-navigation.tsx`)

**Purpose**: Global navigation header with branding, search, and user controls
**Height**: 64px (`h-16`)

#### Components & Features

**Brand Section**:
- **Logo**: 40x40px green circle with Brain icon
- **Title**: "GPTWorkDesk" (xl font, semibold)
- **Color Scheme**: Green primary (#66BB6A)

**Global Search**:
- **Container**: Centered with max-width
- **Input**: 
  - Placeholder: "Search GPTs, chats, documents..."
  - Left icon: Search (gray, 16px)
  - Focus states: Green accent border and ring
- **Functionality**: Global search across all content types

**Right Actions Section**:
- **Notifications** (Admin/Super Admin only):
  - Bell icon button
  - Red notification dot indicator
  - Ghost button variant

**User Profile Dropdown**:
- **Trigger**: 
  - Avatar with initials (generated from full name)
  - User info (name and team, hidden on mobile)
  - Background: Light green (#B9E769)
- **Content**:
  - **Header**: User details with role badge
  - **Menu Items**:
    - Profile (User icon)
    - Settings (Settings icon)  
    - Sign out (LogOut icon, red text)

**Role Badge Colors**:
```typescript
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "super_admin": return "bg-red-100 text-red-800 border-red-200"
    case "admin": return "bg-blue-100 text-blue-800 border-blue-200"  
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
```

### Sidebar Navigation (`components/layout/sidebar-navigation.tsx`)

**Purpose**: Role-based navigation menu with collapsible functionality
**Width**: 256px expanded, 64px collapsed

#### Features & Functionality

**Collapse Toggle**:
- **Button**: Ghost variant, centered
- **Icons**: ChevronLeft (expanded) / ChevronRight (collapsed)
- **Border**: Bottom border separator

**Navigation Items**:
- **Active State Detection**: Uses `usePathname()` hook
- **Item Structure**:
  - Icon (20px, colored based on active state)
  - Text content (hidden when collapsed)
  - Description (small gray text, hidden when collapsed)

**Styling States**:
```typescript
const itemStyles = cn(
  "w-full justify-start h-12 transition-all duration-200",
  isActive
    ? "bg-[#EAF9FD] text-[#66BB6A] border border-[#66BB6A]/20"
    : "hover:bg-gray-50 text-gray-700",
  isCollapsed && "justify-center px-2"
)
```

**Responsive Behavior**:
- **Transition**: Smooth width animation (300ms)
- **Icon Spacing**: Adjusts based on collapsed state
- **Text Visibility**: Conditional rendering based on state

### Main Content (`components/layout/main-content.tsx`)

**Purpose**: Content area wrapper with optional header
**Layout**: Flex column with header and scrollable content

**Props Interface**:
```typescript
interface MainContentProps {
  children: React.ReactNode
  title?: string
  description?: string
}
```

**Structure**:
- **Header** (conditional):
  - Title: h1 with large font and dark color
  - Description: Paragraph with gray text
  - Padding: 24px horizontal, 24px top
- **Content Area**:
  - Flex: 1 (takes remaining space)
  - Overflow: Auto (scrollable)
  - Padding: 24px horizontal, 24px bottom

### Chat Interface (`components/chat/chat-interface.tsx`)

**Purpose**: Real-time chat interface with AI streaming responses
**Layout**: Header + messages area + input footer

#### Props Interface
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

#### Component Structure

**Header Section**:
- **Title**: GPT name with Brain icon
- **Session ID**: Displayed if available (last 8 characters)
- **Description**: GPT description text
- **Styling**: Border bottom, fixed height

**Messages Area**:
- **Container**: Scrollable area with custom scrollbar
- **Empty State**: 
  - Large Brain icon (gray)
  - Welcome message
  - New Chat button (if callback provided)

**Message Rendering**:
```typescript
interface MessageDisplay {
  user: {
    alignment: "justify-end"
    bubble: "bg-[#66BB6A] text-white rounded-br-none"
    avatar: "You" (gray background)
  }
  assistant: {
    alignment: "justify-start"  
    bubble: "bg-gray-100 text-[#2C2C2C] rounded-bl-none border"
    avatar: Brain icon (green background)
  }
}
```

**Loading Animation**:
- **Container**: Assistant message bubble
- **Animation**: Three bouncing dots with staggered delays
- **Colors**: Gray dots on light background

**Input Footer**:
- **Form**: Full-width with gap between input and button
- **Input**: 
  - Placeholder: Dynamic based on GPT name
  - Disabled during loading
  - Focus states with green accent
- **Send Button**:
  - Send icon
  - Disabled when loading or empty input
  - Primary button styling

#### AI Integration
```typescript
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  initialMessages: initialMessages.map(msg => ({
    id: msg.id,
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.content
  })),
  api: "/api/chat",
  body: {
    sessionId: sessionId,
    gptName: gptName
  }
})
```

**Auto-scroll Functionality**:
```typescript
const messagesEndRef = React.useRef<HTMLDivElement>(null)

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}

React.useEffect(() => {
  scrollToBottom()
}, [messages])
```

## State Management

### Authentication Context (`hooks/use-auth.tsx`)

**Purpose**: Global authentication state management
**Provider**: Wraps entire application

#### Context Interface
```typescript
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}
```

#### Implementation Details
**State Management**:
- **User State**: Current user object or null
- **Loading State**: Authentication check status
- **Persistence**: localStorage for session management

**Login Flow**:
1. Set loading state
2. Simulate API delay (1 second)
3. Check credentials against mock users
4. Store user in localStorage on success
5. Return boolean result

**Mock Authentication**:
- **Password**: "password123" for all accounts
- **User Lookup**: Email-based user matching
- **Session Storage**: JSON serialization in localStorage

### Supabase Authentication (`hooks/use-supabase-auth.tsx`)

**Purpose**: Enhanced authentication with Supabase integration
**Features**: Real authentication, profile management, permissions

#### Enhanced Context Interface
```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>
  refreshUser: () => Promise<void>
}
```

#### Permission Utilities
```typescript
export function usePermissions() {
  const { user } = useSupabaseAuth()

  return {
    isUser: user?.role === 'user',
    isAdmin: user?.role === 'admin', 
    isSuperAdmin: user?.role === 'super_admin',
    isAdminOrSuper: isAdmin || isSuperAdmin,
    canManageTeam: isAdminOrSuper,
    canManageUsers: isAdminOrSuper,
    canViewAnalytics: isAdminOrSuper,
    canManageGPTs: true,
    canDeleteGPTs: isAdminOrSuper,
    canViewAuditLogs: isAdminOrSuper
  }
}
```

### Local State Patterns

#### Search and Filter State
```typescript
// Common pattern across list pages
const [searchQuery, setSearchQuery] = useState("")
const [filterStatus, setFilterStatus] = useState("all")
const [filterCategory, setFilterCategory] = useState("all")

// Derived state for filtering
const filteredItems = items.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
  const matchesStatus = filterStatus === "all" || item.status === filterStatus
  const matchesCategory = filterCategory === "all" || item.category === filterCategory
  return matchesSearch && matchesStatus && matchesCategory
})
```

#### Modal/Dialog State
```typescript
// Dialog management pattern
const [isDialogOpen, setIsDialogOpen] = useState(false)
const [selectedItem, setSelectedItem] = useState<ItemType | null>(null)
const [formData, setFormData] = useState<FormData>({})

const handleOpenDialog = (item?: ItemType) => {
  setSelectedItem(item || null)
  setIsDialogOpen(true)
}

const handleCloseDialog = () => {
  setIsDialogOpen(false)
  setSelectedItem(null)
  setFormData({})
}
```

#### Loading and Error State
```typescript
// API interaction pattern
const [data, setData] = useState<DataType[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

const fetchData = async () => {
  try {
    setLoading(true)
    setError(null)
    const response = await fetch('/api/endpoint')
    if (!response.ok) throw new Error('Failed to fetch')
    const result = await response.json()
    setData(result)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

## Styling & Design System

### Color Palette

#### Primary Colors
```css
:root {
  --primary-green: #66BB6A;
  --light-green: #D4ED91;
  --accent-green: #B9E769;
  --soft-blue: #EAF9FD;
  --border-gray: #E0E0E0;
  --text-charcoal: #2C2C2C;
  --bg-white: #FFFFFF;
}
```

#### Tailwind Configuration
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#66BB6A",
        foreground: "hsl(var(--primary-foreground))"
      },
      secondary: {
        DEFAULT: "#B9E769", 
        foreground: "hsl(var(--secondary-foreground))"
      },
      accent: {
        DEFAULT: "#EAF9FD",
        foreground: "hsl(var(--accent-foreground))"
      }
    }
  }
}
```

### Component Styling Classes

#### Button Variants
```css
.btn-primary {
  @apply bg-primary text-white hover:bg-primary/90;
}

.btn-secondary {
  @apply bg-secondary text-[#2C2C2C] hover:bg-secondary/90;
}
```

#### Card Hover Effects
```css
.card-hover {
  @apply transition-transform duration-200 hover:scale-[1.02];
}
```

### Typography System

#### Font Configuration
- **Primary Font**: Inter (Google Fonts)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Font Features**: Ligatures and contextual alternates enabled

#### Text Hierarchy
```typescript
const textStyles = {
  h1: "text-2xl font-semibold text-[#2C2C2C]",
  h2: "text-xl font-semibold text-[#2C2C2C]", 
  h3: "text-lg font-medium text-[#2C2C2C]",
  body: "text-sm text-gray-600",
  caption: "text-xs text-gray-500",
  link: "text-blue-600 hover:underline"
}
```

### Spacing System

#### Consistent Spacing
- **Card Padding**: `p-6` (24px)
- **Section Gaps**: `gap-6` (24px)
- **Component Spacing**: `space-y-4` (16px)
- **Grid Gaps**: `gap-4` (16px) or `gap-6` (24px)

#### Layout Margins
- **Page Margins**: `px-6 pb-6` (24px horizontal, 24px bottom)
- **Content Margins**: `mb-6` (24px bottom)

### Interactive States

#### Focus States
```css
.focus-ring {
  @apply focus:border-[#66BB6A] focus:ring-[#66BB6A] focus:ring-2 focus:ring-opacity-20;
}
```

#### Hover Effects
```css
.hover-lift {
  @apply transition-all duration-200 hover:shadow-md;
}

.hover-bg {
  @apply hover:bg-gray-50 transition-colors duration-150;
}
```

#### Active States
```css
.active-nav {
  @apply bg-[#EAF9FD] text-[#66BB6A] border border-[#66BB6A]/20;
}
```

## Data Flow & API Integration

### Current API Structure

#### Mock Data Integration
**Location**: `lib/mock-data.ts` and `lib/mock-gpts.ts`
**Usage**: Development and demonstration purposes

**Data Categories**:
- Users (5 entries across roles)
- GPTs (5 entries with various statuses)
- Projects (3 entries)
- Documents (3 entries)
- Templates (2 entries)
- Chat Sessions (5 entries)
- Chat Messages (conversation samples)
- Teams (3 entries)

#### API Routes

**Chat Streaming** (`app/api/chat/route.ts`):
```typescript
POST /api/chat
Body: {
  messages: Message[]
  sessionId?: string
  gptName: string
}
Response: Streaming text response
```

**GPT Management** (`app/api/gpts/route.ts`):
```typescript
GET /api/gpts
Response: GPT[]

POST /api/gpts  
Body: GPTCreateRequest
Response: GPT
```

**GPT Operations** (`app/api/gpts/[id]/route.ts`):
```typescript
GET /api/gpts/:id
Response: GPT

PUT /api/gpts/:id
Body: GPTUpdateRequest
Response: GPT

DELETE /api/gpts/:id
Response: 204 No Content
```

### Supabase Integration Structure

#### API Services (`lib/supabase/api/`)

**GPTs Service** (`gpts.ts`):
```typescript
class GPTsAPI {
  async getGPTs(filters?: GPTFilters): Promise<APIResponse<GPT[]>>
  async getGPT(id: string): Promise<APIResponse<GPT>>
  async createGPT(gpt: GPTInsert): Promise<APIResponse<GPT>>
  async updateGPT(id: string, updates: GPTUpdate): Promise<APIResponse<GPT>>
  async deleteGPT(id: string): Promise<APIResponse<void>>
  async getGPTStats(gptId: string, dateRange?: DateRange): Promise<APIResponse<GPTStats>>
  async rateGPT(gptId: string, rating: number): Promise<APIResponse<GPT>>
}
```

**Chat Service** (`chat.ts`):
```typescript
class ChatAPI {
  async getChatSessions(filters?: SessionFilters): Promise<APIResponse<ChatSession[]>>
  async getChatSession(id: string, includeMessages?: boolean): Promise<APIResponse<ChatSessionWithMessages>>
  async createChatSession(session: SessionInsert): Promise<APIResponse<ChatSession>>
  async addChatMessage(message: MessageInsert): Promise<APIResponse<ChatMessage>>
  async searchMessages(query: string, filters?: SearchFilters): Promise<APIResponse<ChatMessage[]>>
}
```

**Users Service** (`users.ts`):
```typescript
class UsersAPI {
  async getUsers(filters?: UserFilters): Promise<APIResponse<User[]>>
  async getCurrentUser(): Promise<APIResponse<UserWithProfile>>
  async updateCurrentUser(updates: UserUpdate): Promise<APIResponse<User>>
  async getUserStats(userId: string, dateRange?: DateRange): Promise<APIResponse<UserStats>>
  async inviteUser(email: string, role: UserRole): Promise<APIResponse<InviteResponse>>
}
```

### Data Fetching Patterns

#### Component-Level Fetching
```typescript
// Standard pattern for data fetching in components
const [data, setData] = useState<DataType[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/endpoint')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [/* dependencies */])
```

#### Error Handling Pattern
```typescript
// Consistent error handling with toast notifications
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

const handleError = (error: unknown, action: string) => {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  
  toast({
    title: `Error ${action}`,
    description: message,
    variant: "destructive"
  })
}
```

#### Loading States
```typescript
// Loading state patterns
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-8 w-8 animate-spin text-[#66BB6A]" />
  </div>
)

const TableSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
)
```

### Real-time Features

#### Chat Streaming Integration
```typescript
// AI SDK integration for streaming responses
import { useChat } from 'ai/react'

const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  body: {
    sessionId,
    gptName
  },
  onFinish: (message) => {
    // Handle completion
    onSendMessage?.(input)
  },
  onError: (error) => {
    // Handle streaming errors
    console.error('Chat error:', error)
  }
})
```

#### Future Real-time Features
- **Live Notifications**: Admin notifications for new GPT requests
- **Presence Indicators**: Show active users in chat sessions
- **Live Updates**: Real-time status updates for GPT approvals
- **Collaborative Features**: Multiple users in same chat session

This comprehensive frontend architecture documentation provides a complete blueprint of every component, page, feature, and interaction in the GPT Desk application. It serves as a detailed reference for understanding the entire frontend structure and can guide both development and maintenance efforts.