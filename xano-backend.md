# Xano Backend Architecture for Custom GPT Desk

## Overview
This document outlines the complete Xano backend structure for the Custom GPT Desk application, a multi-tenant AI workspace platform with role-based access control supporting Users, Admins, and Super Admins.

## Database Schema

### Core Tables

#### 1. users
```sql
- id (UUID, Primary Key)
- email (Text, Unique, Required)
- full_name (Text, Required)
- password_hash (Text, Required)
- role (Enum: 'user', 'admin', 'super_admin')
- team_id (UUID, Foreign Key -> teams.id)
- avatar (Text, URL)
- status (Enum: 'active', 'inactive', 'suspended')
- last_active (DateTime)
- created_at (DateTime, Auto)
- updated_at (DateTime, Auto)
```

#### 2. teams
```sql
- id (UUID, Primary Key)
- name (Text, Required)
- description (Text)
- member_count (Integer, Default: 0)
- settings (JSON)
- created_at (DateTime, Auto)
- updated_at (DateTime, Auto)
```

#### 3. gpts
```sql
- id (UUID, Primary Key)
- name (Text, Required)
- description (Text, Required)
- category (Text)
- status (Enum: 'active', 'inactive', 'pending', 'suspended')
- creator_id (UUID, Foreign Key -> users.id)
- team_id (UUID, Foreign Key -> teams.id)
- prompt (Text, Large)
- model (Text, Default: 'gpt-4')
- temperature (Float, Default: 0.7)
- max_tokens (Integer, Default: 2000)
- usage_count (Integer, Default: 0)
- rating (Float)
- tags (JSON Array)
- is_public (Boolean, Default: false)
- access_level (Enum: 'team', 'organization')
- web_access (Boolean, Default: false)
- approval_status (Enum: 'approved', 'pending', 'rejected')
- monthly_cost (Float)
- compliance_score (Float)
- risk_level (Enum: 'low', 'medium', 'high')
- active_users (Integer, Default: 0)
- created_at (DateTime, Auto)
- updated_at (DateTime, Auto)
```

#### 4. chat_sessions
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> users.id)
- gpt_id (UUID, Foreign Key -> gpts.id)
- title (Text, Required)
- message_count (Integer, Default: 0)
- status (Enum: 'active', 'completed', 'archived')
- created_at (DateTime, Auto)
- updated_at (DateTime, Auto)
```

#### 5. chat_messages
```sql
- id (UUID, Primary Key)
- session_id (UUID, Foreign Key -> chat_sessions.id)
- content (Text, Large, Required)
- role (Enum: 'user', 'assistant')
- tokens_used (Integer)
- created_at (DateTime, Auto)
```

#### 6. documents
```sql
- id (UUID, Primary Key)
- name (Text, Required)
- file_url (Text, Required)
- file_type (Text)
- file_size (Integer)
- uploaded_by (UUID, Foreign Key -> users.id)
- team_id (UUID, Foreign Key -> teams.id)
- project_id (UUID, Foreign Key -> projects.id, Nullable)
- access_level (Enum: 'private', 'team', 'organization')
- tags (JSON Array)
- created_at (DateTime, Auto)
- updated_at (DateTime, Auto)
```

#### 7. projects
```sql
- id (UUID, Primary Key)
- name (Text, Required)
- description (Text)
- status (Enum: 'active', 'completed', 'archived')
- user_id (UUID, Foreign Key -> users.id)
- team_id (UUID, Foreign Key -> teams.id)
- created_at (DateTime, Auto)
- updated_at (DateTime, Auto)
```

#### 8. templates
```sql
- id (UUID, Primary Key)
- name (Text, Required)
- description (Text)
- content (Text, Large, Required)
- category (Text)
- created_by (UUID, Foreign Key -> users.id)
- team_id (UUID, Foreign Key -> teams.id)
- access_level (Enum: 'private', 'team', 'organization')
- usage_count (Integer, Default: 0)
- created_at (DateTime, Auto)
- updated_at (DateTime, Auto)
```

#### 9. analytics
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> users.id)
- team_id (UUID, Foreign Key -> teams.id)
- gpt_id (UUID, Foreign Key -> gpts.id, Nullable)
- action_type (Enum: 'chat', 'document_upload', 'gpt_create', 'template_create')
- metadata (JSON)
- tokens_used (Integer)
- cost (Float)
- created_at (DateTime, Auto)
```

#### 10. audit_logs
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> users.id)
- action (Text, Required)
- resource_type (Text)
- resource_id (UUID)
- details (JSON)
- ip_address (Text)
- user_agent (Text)
- created_at (DateTime, Auto)
```

## API Endpoints Structure

### Authentication Endpoints
POST /auth/login POST /auth/logout POST /auth/refresh GET /auth/me


### User Management
GET /users # Super Admin only GET /users/me # Current user profile PUT /users/me # Update profile GET /users/team # Team members (Admin+) POST /users/invite # Invite users (Admin+) PUT /users/{id} # Update user (Admin+) DELETE /users/{id} # Delete user (Super Admin only)


### Team Management
GET /teams # Super Admin only POST /teams # Super Admin only GET /teams/{id} # Team details (Admin+) PUT /teams/{id} # Update team (Admin+) DELETE /teams/{id} # Super Admin only GET /teams/{id}/members # Team members (Admin+)


### GPT Management
GET /gpts # List GPTs (filtered by access) POST /gpts # Create GPT (Admin+) GET /gpts/{id} # GPT details PUT /gpts/{id} # Update GPT (Creator/Admin+) DELETE /gpts/{id} # Delete GPT (Creator/Admin+) PUT /gpts/{id}/approve # Approve GPT (Super Admin only) GET /gpts/{id}/analytics # GPT usage analytics


### Chat Management
GET /chats/sessions # User's chat sessions POST /chats/sessions # Create new session GET /chats/sessions/{id} # Session details PUT /chats/sessions/{id} # Update session DELETE /chats/sessions/{id} # Delete session GET /chats/sessions/{id}/messages # Session messages POST /chats/sessions/{id}/messages # Send message GET /chats/logs # Chat logs (Admin+)


### Document Management
GET /documents # List documents (filtered by access) POST /documents # Upload document GET /documents/{id} # Document details PUT /documents/{id} # Update document metadata DELETE /documents/{id} # Delete document GET /documents/{id}/download # Download document


### Project Management
GET /projects # User's projects POST /projects # Create project GET /projects/{id} # Project details PUT /projects/{id} # Update project DELETE /projects/{id} # Delete project


### Template Management
GET /templates # List templates (filtered by access) POST /templates # Create template GET /templates/{id} # Template details PUT /templates/{id} # Update template DELETE /templates/{id} # Delete template


### Analytics & Reporting
GET /analytics/dashboard # Dashboard metrics GET /analytics/usage # Usage statistics GET /analytics/costs # Cost analysis GET /analytics/audit # Audit logs (Admin+)

------------

## Xano Functions & Business Logic

### Authentication Functions
- `authenticate_user(email, password)` - Login validation
- `generate_jwt_token(user_id, role)` - Token generation
- `validate_token(token)` - Token validation
- `refresh_token(refresh_token)` - Token refresh

### Authorization Functions
- `check_user_permissions(user_id, action, resource)` - Permission validation
- `get_user_accessible_teams(user_id)` - Team access list
- `can_access_gpt(user_id, gpt_id)` - GPT access validation
- `can_manage_user(admin_id, target_user_id)` - User management validation

### GPT Management Functions
- `create_gpt(gpt_data, creator_id)` - GPT creation with validation
- `approve_gpt(gpt_id, approver_id)` - GPT approval workflow
- `calculate_gpt_metrics(gpt_id)` - Usage and performance metrics
- `update_gpt_usage(gpt_id, tokens_used)` - Usage tracking

### Chat Functions
- `create_chat_session(user_id, gpt_id, title)` - Session creation
- `send_message(session_id, content, role)` - Message handling
- `calculate_chat_cost(tokens_used, model)` - Cost calculation
- `archive_old_sessions()` - Cleanup function

### Analytics Functions
- `log_user_action(user_id, action, metadata)` - Activity logging
- `generate_dashboard_metrics(user_id, date_range)` - Dashboard data
- `calculate_team_usage(team_id, date_range)` - Team analytics
- `generate_cost_report(team_id, date_range)` - Cost reporting

## Role-Based Access Control (RBAC)

### User Role Permissions
**Users:**
- Read: Own profile, team documents, team GPTs, own chats/projects
- Write: Own profile, own chats/projects, use GPTs
- No access: User management, system settings, analytics

**Admins:**
- Read: Team data, team member profiles, team analytics
- Write: Team GPTs, team templates, team member invitations
- Manage: Team members (except other admins), team resources
- No access: Other teams, system-wide settings, user roles

**Super Admins:**
- Read: All data across organization
- Write: All resources, system settings
- Manage: All users, teams, GPTs, system configuration
- Full access: Analytics, audit logs, security settings

### Data Filtering Logic
```javascript
// Example Xano function for filtered data access
function get_filtered_gpts(user_id) {
  const user = get_user(user_id);
  
  if (user.role === 'super_admin') {
    return get_all_gpts();
  } else if (user.role === 'admin') {
    return get_gpts_by_team(user.team_id);
  } else {
    return get_accessible_gpts(user_id, user.team_id);
  }
}


------------

Security Implementation
Authentication Flow
User submits credentials
Validate against users table
Generate JWT with role and team_id
Return token with user profile
Validate token on each request
Authorization Middleware
Route-level permission checks
Resource-level access validation
Team boundary enforcement
Audit logging for sensitive actions
Data Security
Row-level security based on team_id
Encrypted sensitive data (prompts, documents)
Rate limiting on API endpoints
Input validation and sanitization
Workflow Integration
GPT Approval Workflow
Admin creates GPT (status: 'pending')
Super Admin reviews and approves
GPT becomes available to team/organization
Usage tracking and analytics collection
Document Sharing Workflow
User uploads document
Set access level (private/team/organization)
Team members can access based on permissions
Audit trail for document access
Chat Session Management
User selects GPT and starts session
Messages stored with token tracking
Cost calculation and billing
Session archival after inactivity
User Access Flow & Dashboard Navigation
1. Authentication Entry Point
Login Screen → Role-based redirect:

user@test.com → /dashboard/user
admin@test.com → /dashboard/admin
superadmin@test.com → /dashboard/super
2. USER ROLE FLOW
Entry Point: /dashboard/user Access Level: Personal + Team Resources

Navigation Structure:
/dashboard/user (Main Dashboard)
├── /chats (My Chats)
│   ├── /[gptId] (Chat with specific GPT)
│   └── /session/[sessionId] (Individual chat session)
├── /projects (My Projects)
├── /prompts (Prompt Library)
├── /documents (Team Documents - Read Only)
└── /settings (Profile Settings)
Data Access Permissions:
READ: Own profile, own chats, own projects, team documents, team GPTs, team templates
WRITE: Own profile, own chats, own projects, own prompts
CREATE: Chat sessions, projects, personal prompts
DELETE: Own chats, own projects, own prompts
FORBIDDEN: User management, team settings, GPT creation, analytics
User Journey:
Login → Dashboard overview with personal stats
Start Chat → Select from available team GPTs → Create session
Manage Projects → Create/organize chat folders
Access Documents → View team-shared resources (read-only)
Use Templates → Access team prompt templates
Profile Settings → Update personal preferences
3. ADMIN ROLE FLOW
Entry Point: /dashboard/admin Access Level: Team Management + Personal Resources

Navigation Structure:
/dashboard/admin (Team Dashboard)
├── /gpts (Team GPTs Management)
│   ├── /new (Create New GPT)
│   └── /edit/[id] (Edit Team GPT)
├── /members (Team Members Management)
├── /chats (Personal Chats)
│   ├── /[gptId] (Chat with specific GPT)
│   └── /session/[sessionId] (Individual chat session)
├── /logs (Team Chat Logs - Monitoring)
├── /documents (Team Document Library)
├── /templates (Team Prompt Templates)
└── /settings (Team Configuration)
Data Access Permissions:
READ: Team data, team member profiles, team analytics, team chat logs
WRITE: Team GPTs, team templates, team settings, member invitations
CREATE: Team GPTs, team templates, team member invitations
DELETE: Team GPTs, team templates, team members (users only)
MANAGE: Team members (except other admins), team resources
FORBIDDEN: Other teams' data, system settings, super admin functions
Admin Journey:
Login → Team dashboard with team metrics
Manage GPTs → Create/edit team AI assistants → Submit for approval
Manage Members → Invite users → Monitor team activity
Monitor Usage → View team chat logs → Analyze performance
Organize Resources → Manage team documents and templates
Team Settings → Configure team preferences and policies
4. SUPER ADMIN ROLE FLOW
Entry Point: /dashboard/super Access Level: Organization-wide + System Management

Navigation Structure:
/dashboard/super (System Overview)
├── /gpts (All GPTs Management)
│   ├── /new (Create Organization GPT)
│   └── /edit/[id] (Edit Any GPT)
├── /users (User Management)
├── /teams (Team Management)
├── /chats (Personal Chats)
│   ├── /[gptId] (Chat with any GPT)
│   └── /session/[sessionId] (Individual chat session)
├── /documents (Document Library)
├── /prompts (Prompt Library)
├── /settings (System Settings)
└── /security (Security & Compliance)

Data Access Permissions:
READ: All data across organization, system metrics, audit logs
WRITE: All resources, system settings, user roles
CREATE: Organization-wide GPTs, teams, system templates
DELETE: Any resource (with audit trail)
MANAGE: All users, teams, GPTs, system configuration
APPROVE: GPT requests, user access changes

Super Admin Journey:
Login → System overview with organization metrics
Approve GPTs → Review pending GPT requests → Approve/reject
Manage Users → Create teams → Assign roles → Monitor activity
System Analytics → View organization-wide usage → Cost analysis
Security Management → Audit logs → Compliance monitoring
System Configuration → Global settings → Feature toggles

--------------------------

API Endpoint Access Matrix
| Endpoint | User | Admin | Super Admin | |----------|------|-------|-------------| | /auth/* | ✅ | ✅ | ✅ | | /users/me | ✅ | ✅ | ✅ | | /users | ❌ | 🔒 Team Only | ✅ | | /teams | 🔍 Read Own | 🔒 Own Team | ✅ | | /gpts | 🔍 Team GPTs | 🔒 Team GPTs | ✅ | | /gpts/approve | ❌ | ❌ | ✅ | | /chats/sessions | 🔒 Own Only | 🔒 Own Only | ✅ | | /chats/logs | ❌ | 🔒 Team Only | ✅ | | /documents | 🔍 Team Docs | 🔒 Team Docs | ✅ | | /projects | 🔒 Own Only | 🔒 Own Only | ✅ | | /templates | 🔍 Team Templates | 🔒 Team Templates | ✅ | | /analytics | ❌ | 🔒 Team Only | ✅ |

Legend:

✅ Full Access
🔒 Scoped Access (filtered by team/ownership)
🔍 Read Only
❌ No Access

# Xano Implementation Notes

### Database Functions
User Authentication: Custom login function with role-based redirects
Permission Middleware: Validate user permissions before data access
Data Filtering: Automatic team/role-based data filtering
Audit Logging: Track all sensitive operations
Usage Tracking: Monitor GPT usage and costs

### API Response Filtering
Implement team_id filtering in all GET endpoints
Role-based field filtering (hide sensitive data from users)
Pagination and search functionality
Error handling with appropriate HTTP status codes

### Background Tasks
Daily: Calculate usage statistics and costs
Weekly: Generate team performance reports
Monthly: Archive old chat sessions
Real-time: Update GPT usage counters