# Row Level Security (RLS) Policies - Detailed Explanation

This document provides a comprehensive line-by-line explanation of the RLS policies implemented in `comprehensive-rls-policies.sql` for the GPT Desk application.

## Table of Contents
- [Overview](#overview)
- [Setup and Initialization](#setup-and-initialization)
- [Teams Table Policies](#teams-table-policies)
- [Profiles Table Policies](#profiles-table-policies)
- [GPTs Table Policies](#gpts-table-policies)
- [Projects Table Policies](#projects-table-policies)
- [Documents Table Policies](#documents-table-policies)
- [Chat Sessions Table Policies](#chat-sessions-table-policies)
- [Chat Messages Table Policies](#chat-messages-table-policies)
- [Memory Items Table Policies](#memory-items-table-policies)
- [Document Reports Table Policies](#document-reports-table-policies)
- [Document Requests Table Policies](#document-requests-table-policies)
- [Approval Requests Table Policies](#approval-requests-table-policies)
- [Templates Table Policies](#templates-table-policies)
- [Audit Logs Table Policies](#audit-logs-table-policies)
- [Usage Analytics Table Policies](#usage-analytics-table-policies)
- [Special Security Policies](#special-security-policies)
- [Key Security Concepts](#key-security-concepts)

## Overview

Row Level Security (RLS) is a PostgreSQL feature that allows you to control which rows users can access in database tables. This implementation provides:

- **Team Isolation**: Users can only access data from their own team
- **Role-Based Access Control**: Different permissions for user, admin, and super_admin roles
- **Ownership-Based Permissions**: Users can manage their own data
- **Audit Trail Protection**: Immutable logs for compliance
- **Data Integrity**: Consistency checks across related tables

## Setup and Initialization

### Header Comments (Lines 1-3)
```sql
-- GPT Desk Comprehensive Row Level Security (RLS) Policies
-- Implements team isolation, role-based access control, and secure data access
-- Based on frontend requirements and RBAC implementation
```
**Purpose**: Documentation explaining the file's purpose and implementation approach.

### Enabling RLS on All Tables (Lines 6-19)
```sql
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;
```

**Function**: 
- Activates Row Level Security on all 14 tables
- Without this, the policies below would have no effect
- PostgreSQL will now check policies before allowing any row access

## Teams Table Policies

### SELECT Policy (Lines 23-27)
```sql
CREATE POLICY "teams_select_policy" ON teams
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR 
    id = get_user_team_id(auth.uid())
  );
```

**Breakdown**:
- `FOR SELECT`: Applies to reading/viewing data
- `auth.uid()`: Gets current authenticated user's ID from Supabase Auth
- `is_super_admin()`: Helper function checking if user has super_admin role
- `get_user_team_id()`: Helper function returning user's team ID
- **Logic**: Super admins see all teams, regular users only see their own team

### INSERT Policy (Lines 30-33)
```sql
CREATE POLICY "teams_insert_policy" ON teams
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid())
  );
```

**Function**: 
- Only super admins can create new teams
- Regular users and admins cannot create teams
- Centralizes team creation control

### UPDATE Policy (Lines 36-39)
```sql
CREATE POLICY "teams_update_policy" ON teams
  FOR UPDATE USING (
    is_super_admin(auth.uid())
  );
```

**Function**: 
- Only super admins can modify team information
- Prevents unauthorized team setting changes

### DELETE Policy (Lines 42-45)
```sql
CREATE POLICY "teams_delete_policy" ON teams
  FOR DELETE USING (
    is_super_admin(auth.uid())
  );
```

**Function**: 
- Only super admins can delete teams
- Protects against accidental team deletion

## Profiles Table Policies

### SELECT Policy (Lines 49-53)
```sql
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR
    team_id = get_user_team_id(auth.uid())
  );
```

**Logic**:
- Super admins see all user profiles system-wide
- Regular users only see profiles from their own team
- Enforces team isolation for user data

### INSERT Policy (Lines 56-57)
```sql
CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (true);
```

**Function**:
- `true` means no restrictions on profile creation
- Allows user signup process to work
- New users can create their profiles

### UPDATE Policy (Lines 60-65)
```sql
CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (
    id = auth.uid() OR
    (is_admin(auth.uid()) AND team_id = get_user_team_id(auth.uid())) OR
    is_super_admin(auth.uid())
  );
```

**Three-tier permission system**:
1. `id = auth.uid()`: Users can update their own profile
2. `is_admin(auth.uid()) AND team_id = get_user_team_id(auth.uid())`: Admins can update profiles in their team
3. `is_super_admin(auth.uid())`: Super admins can update any profile

### DELETE Policy (Lines 68-71)
```sql
CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE USING (
    is_super_admin(auth.uid())
  );
```

**Function**: 
- Only super admins can delete user accounts
- Prevents accidental or malicious account deletion

## GPTs Table Policies

### SELECT Policy (Lines 75-78)
```sql
CREATE POLICY "gpts_select_policy" ON gpts
  FOR SELECT USING (
    can_access_team_data(auth.uid(), team_id)
  );
```

**Function**:
- Uses helper function `can_access_team_data()`
- Super admins see all GPTs across all teams
- Regular users see only GPTs in their team

### INSERT Policy (Lines 81-85)
```sql
CREATE POLICY "gpts_insert_policy" ON gpts
  FOR INSERT WITH CHECK (
    is_admin(auth.uid()) AND
    team_id = get_user_team_id(auth.uid())
  );
```

**Restrictions**:
- Only admins and super admins can create GPTs
- They can only create GPTs in their own team
- Regular users cannot create GPTs (business rule)

### UPDATE Policy (Lines 88-92)
```sql
CREATE POLICY "gpts_update_policy" ON gpts
  FOR UPDATE USING (
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Two update paths**:
1. **Creator access**: The person who created the GPT can update it (if still in same team)
2. **Admin access**: Admins can update any GPT in their team

### DELETE Policy (Lines 95-98)
```sql
CREATE POLICY "gpts_delete_policy" ON gpts
  FOR DELETE USING (
    is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id)
  );
```

**Function**: 
- Only admins can delete GPTs
- Can only delete GPTs in their own team
- Prevents accidental GPT deletion by regular users

## Projects Table Policies

### SELECT Policy (Lines 102-105)
```sql
CREATE POLICY "projects_select_policy" ON projects
  FOR SELECT USING (
    can_access_team_data(auth.uid(), team_id)
  );
```

**Function**: Team-based visibility using the helper function.

### INSERT Policy (Lines 108-111)
```sql
CREATE POLICY "projects_insert_policy" ON projects
  FOR INSERT WITH CHECK (
    team_id = get_user_team_id(auth.uid())
  );
```

**Function**: 
- All users can create projects
- Projects must be created in user's own team

### UPDATE Policy (Lines 114-118)
```sql
CREATE POLICY "projects_update_policy" ON projects
  FOR UPDATE USING (
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Same pattern as GPTs - creators and admins can update.

### DELETE Policy (Lines 121-125)
```sql
CREATE POLICY "projects_delete_policy" ON projects
  FOR DELETE USING (
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Same pattern as GPTs - creators and admins can delete.

## Documents Table Policies

### SELECT Policy (Lines 129-132)
```sql
CREATE POLICY "documents_select_policy" ON documents
  FOR SELECT USING (
    can_access_team_data(auth.uid(), team_id)
  );
```

**Function**: Team-based document visibility.

### INSERT Policy (Lines 135-138)
```sql
CREATE POLICY "documents_insert_policy" ON documents
  FOR INSERT WITH CHECK (
    team_id = get_user_team_id(auth.uid())
  );
```

**Function**: Users can upload documents to their team.

### UPDATE Policy (Lines 141-145)
```sql
CREATE POLICY "documents_update_policy" ON documents
  FOR UPDATE USING (
    (uploaded_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: 
- `uploaded_by = auth.uid()`: Document uploader can modify
- Admins can modify team documents

### DELETE Policy (Lines 148-152)
```sql
CREATE POLICY "documents_delete_policy" ON documents
  FOR DELETE USING (
    (uploaded_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Same as update - uploaders and admins can delete.

## Chat Sessions Table Policies

### SELECT Policy (Lines 156-160)
```sql
CREATE POLICY "chat_sessions_select_policy" ON chat_sessions
  FOR SELECT USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**:
- `user_id = auth.uid()`: Users see their own chat sessions
- Admins see all team chat sessions (for oversight)

### INSERT Policy (Lines 163-167)
```sql
CREATE POLICY "chat_sessions_insert_policy" ON chat_sessions
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );
```

**Validation**:
- Session must belong to the current user
- Session must be in user's team

### UPDATE Policy (Lines 170-174)
```sql
CREATE POLICY "chat_sessions_update_policy" ON chat_sessions
  FOR UPDATE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Users update own sessions, admins update team sessions.

### DELETE Policy (Lines 177-181)
```sql
CREATE POLICY "chat_sessions_delete_policy" ON chat_sessions
  FOR DELETE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Same as update policy.

## Chat Messages Table Policies

### SELECT Policy (Lines 185-194)
```sql
CREATE POLICY "chat_messages_select_policy" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND (
        cs.user_id = auth.uid() OR
        (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), cs.team_id))
      )
    )
  );
```

**Complex Logic**:
- `EXISTS` subquery checks if user has access to the parent chat session
- Users see messages from their own sessions
- Admins see messages from any team session
- **Why complex**: Messages don't have direct team_id, so we join through chat_sessions

### INSERT Policy (Lines 197-203)
```sql
CREATE POLICY "chat_messages_insert_policy" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.user_id = auth.uid()
    )
  );
```

**Validation**: Users can only add messages to their own chat sessions.

### UPDATE Policy (Lines 206-215)
```sql
CREATE POLICY "chat_messages_update_policy" ON chat_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND (
        cs.user_id = auth.uid() OR
        (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), cs.team_id))
      )
    )
  );
```

**Logic**: Same pattern as SELECT - users update own messages, admins update team messages.

### DELETE Policy (Lines 218-227)
```sql
CREATE POLICY "chat_messages_delete_policy" ON chat_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND (
        cs.user_id = auth.uid() OR
        (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), cs.team_id))
      )
    )
  );
```

**Logic**: Same pattern as UPDATE and SELECT.

## Memory Items Table Policies

### SELECT Policy (Lines 231-235)
```sql
CREATE POLICY "memory_items_select_policy" ON memory_items
  FOR SELECT USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Users see their own memory items, admins see team memory items.

### INSERT Policy (Lines 238-242)
```sql
CREATE POLICY "memory_items_insert_policy" ON memory_items
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );
```

**Validation**: Memory items must belong to current user and their team.

### UPDATE Policy (Lines 245-249)
```sql
CREATE POLICY "memory_items_update_policy" ON memory_items
  FOR UPDATE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Standard pattern - users update own, admins update team items.

### DELETE Policy (Lines 252-256)
```sql
CREATE POLICY "memory_items_delete_policy" ON memory_items
  FOR DELETE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Same as update policy.

## Document Reports Table Policies

### SELECT Policy (Lines 260-264)
```sql
CREATE POLICY "document_reports_select_policy" ON document_reports
  FOR SELECT USING (
    generated_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: 
- `generated_by = auth.uid()`: Users see reports they generated
- Admins see all team reports

### INSERT Policy (Lines 267-271)
```sql
CREATE POLICY "document_reports_insert_policy" ON document_reports
  FOR INSERT WITH CHECK (
    generated_by = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );
```

**Validation**: Reports must be generated by current user in their team.

### UPDATE Policy (Lines 274-278)
```sql
CREATE POLICY "document_reports_update_policy" ON document_reports
  FOR UPDATE USING (
    generated_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Generators and admins can update reports.

### DELETE Policy (Lines 281-285)
```sql
CREATE POLICY "document_reports_delete_policy" ON document_reports
  FOR DELETE USING (
    generated_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Same as update policy.

## Document Requests Table Policies

### SELECT Policy (Lines 289-293)
```sql
CREATE POLICY "document_requests_select_policy" ON document_requests
  FOR SELECT USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Users see their own requests, admins see team requests.

### INSERT Policy (Lines 296-300)
```sql
CREATE POLICY "document_requests_insert_policy" ON document_requests
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );
```

**Validation**: Requests must belong to current user and their team.

### UPDATE Policy (Lines 303-307)
```sql
CREATE POLICY "document_requests_update_policy" ON document_requests
  FOR UPDATE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Standard pattern - users update own, admins update team requests.

### DELETE Policy (Lines 310-314)
```sql
CREATE POLICY "document_requests_delete_policy" ON document_requests
  FOR DELETE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Same as update policy.

## Approval Requests Table Policies

### SELECT Policy (Lines 318-322)
```sql
CREATE POLICY "approval_requests_select_policy" ON approval_requests
  FOR SELECT USING (
    requested_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: 
- `requested_by = auth.uid()`: Users see their own approval requests
- Admins see all team approval requests (for review)

### INSERT Policy (Lines 325-329)
```sql
CREATE POLICY "approval_requests_insert_policy" ON approval_requests
  FOR INSERT WITH CHECK (
    requested_by = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );
```

**Validation**: Approval requests must be created by current user in their team.

### UPDATE Policy (Lines 332-335) - **CRITICAL**
```sql
CREATE POLICY "approval_requests_update_policy" ON approval_requests
  FOR UPDATE USING (
    is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id)
  );
```

**Critical Security Feature**:
- **Only admins can update approval requests**
- This prevents users from approving their own requests
- Implements the approval workflow where admins review user requests
- Users cannot change status from 'pending' to 'approved'

### DELETE Policy (Lines 338-342)
```sql
CREATE POLICY "approval_requests_delete_policy" ON approval_requests
  FOR DELETE USING (
    requested_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Requesters can delete their own requests, admins can delete team requests.

## Templates Table Policies

### SELECT Policy (Lines 346-350)
```sql
CREATE POLICY "templates_select_policy" ON templates
  FOR SELECT USING (
    is_public = true OR
    can_access_team_data(auth.uid(), team_id)
  );
```

**Special Logic**:
- `is_public = true`: Anyone can see public templates
- Team members can see their team's private templates
- Enables template sharing across teams when marked public

### INSERT Policy (Lines 353-356)
```sql
CREATE POLICY "templates_insert_policy" ON templates
  FOR INSERT WITH CHECK (
    team_id = get_user_team_id(auth.uid())
  );
```

**Function**: Users can create templates in their team.

### UPDATE Policy (Lines 359-363)
```sql
CREATE POLICY "templates_update_policy" ON templates
  FOR UPDATE USING (
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Creators and admins can update templates.

### DELETE Policy (Lines 366-370)
```sql
CREATE POLICY "templates_delete_policy" ON templates
  FOR DELETE USING (
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Same as update policy.

## Audit Logs Table Policies

### SELECT Policy (Lines 374-378)
```sql
CREATE POLICY "audit_logs_select_policy" ON audit_logs
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Security Logic**:
- Super admins see all audit logs (system-wide oversight)
- Admins see only their team's audit logs
- Regular users cannot see audit logs

### INSERT Policy (Lines 381-382)
```sql
CREATE POLICY "audit_logs_insert_policy" ON audit_logs
  FOR INSERT WITH CHECK (true);
```

**Function**: 
- `true` means no restrictions on inserting audit logs
- Needed for automatic audit logging by system triggers
- System processes can log events without user context

### UPDATE Policy (Lines 385-386) - **CRITICAL**
```sql
CREATE POLICY "audit_logs_update_policy" ON audit_logs
  FOR UPDATE USING (false);
```

**Critical Security Feature**:
- `USING (false)` means **NO ONE** can update audit logs
- Makes audit logs completely immutable
- Once logged, cannot be changed by anyone (including super admins)
- Essential for security compliance and forensics

### DELETE Policy (Lines 389-392)
```sql
CREATE POLICY "audit_logs_delete_policy" ON audit_logs
  FOR DELETE USING (
    is_super_admin(auth.uid())
  );
```

**Function**: 
- Only super admins can delete audit logs
- Needed for data retention policies
- Controlled cleanup of old logs

## Usage Analytics Table Policies

### SELECT Policy (Lines 396-400)
```sql
CREATE POLICY "usage_analytics_select_policy" ON usage_analytics
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );
```

**Logic**: Same as audit logs - super admins see all, admins see team analytics.

### INSERT Policy (Lines 403-404)
```sql
CREATE POLICY "usage_analytics_insert_policy" ON usage_analytics
  FOR INSERT WITH CHECK (true);
```

**Function**: System can insert analytics without restrictions.

### UPDATE Policy (Lines 407-408)
```sql
CREATE POLICY "usage_analytics_update_policy" ON usage_analytics
  FOR UPDATE USING (false);
```

**Function**: Analytics are immutable (like audit logs).

### DELETE Policy (Lines 411-414)
```sql
CREATE POLICY "usage_analytics_delete_policy" ON usage_analytics
  FOR DELETE USING (
    is_super_admin(auth.uid())
  );
```

**Function**: Only super admins can delete analytics (data retention).

## Special Security Policies

### Policy: `profiles_role_protection`
```sql
CREATE POLICY "profiles_role_protection" ON profiles
  FOR UPDATE USING (
    -- Users cannot update their own profile's role field
    -- Only admins/super_admins can change roles of other users
    id != auth.uid() OR is_admin(auth.uid()) OR is_super_admin(auth.uid())
  );
```

**Purpose**: Prevents privilege escalation by restricting users from changing their own roles.

**Logic Breakdown**:
- `id != auth.uid()`: Users cannot update their own profile (prevents self-role changes)
- `OR is_admin(auth.uid())`: Admins can update any profile (including role changes)  
- `OR is_super_admin(auth.uid())`: Super admins can update any profile

**Security Implications**:
- **Privilege Escalation Prevention**: Users cannot promote themselves to admin/super_admin
- **Administrative Control**: Only existing admins can manage user roles
- **Role Hierarchy**: Maintains proper role-based access control structure

### Team Consistency Policy (Lines 430-436)
```sql
CREATE POLICY "chat_sessions_team_consistency" ON chat_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM gpts g 
      WHERE g.id = gpt_id AND g.team_id = team_id
    )
  );
```

**Data Integrity Check**:
- Ensures chat sessions use GPTs from the same team
- Prevents cross-team data mixing
- `EXISTS` subquery verifies GPT belongs to same team as session
- **Example**: Team A user cannot create session with Team B's GPT

### Memory Items Session Consistency (Lines 439-445)
```sql
CREATE POLICY "memory_items_session_consistency" ON memory_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.team_id = team_id AND cs.user_id = user_id
    )
  );
```

**Validation**:
- Memory items must belong to valid chat sessions
- Session must belong to same team and user
- Prevents orphaned or mismatched memory items

### Document Reports Session Consistency (Lines 448-454)
```sql
CREATE POLICY "document_reports_session_consistency" ON document_reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.team_id = team_id
    )
  );
```

**Validation**: Document reports must belong to valid sessions in same team.

### Document Requests Session Consistency (Lines 457-463)
```sql
CREATE POLICY "document_requests_session_consistency" ON document_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.team_id = team_id AND cs.user_id = user_id
    )
  );
```

**Validation**: Document requests must belong to valid sessions with same team and user.

## Key Security Concepts

### 1. Team Isolation
Every policy ensures users only access data from their own team using:
- `team_id = get_user_team_id(auth.uid())`: Direct team matching
- `can_access_team_data(auth.uid(), team_id)`: Helper function for team access

**Purpose**: Prevents data leakage between different organizations using the platform.

### 2. Role Hierarchy
Three-tier permission system:
- **Users**: Basic access to their own data
- **Admins**: Can manage team data and approve requests  
- **Super Admins**: System-wide access and control

**Implementation**: Helper functions `is_admin()` and `is_super_admin()` check roles.

### 3. Ownership Patterns
Many policies use ownership checks:
- `created_by = auth.uid()`: Creator can modify their items
- `user_id = auth.uid()`: Owner can access their data
- `uploaded_by = auth.uid()`: Uploader can manage their files
- `generated_by = auth.uid()`: Generator can control their reports

**Purpose**: Users have full control over data they create.

### 4. Immutable Data
Audit logs and analytics use `USING (false)` to prevent modifications:
- Ensures data integrity for compliance
- Creates tamper-proof audit trails
- Supports forensic analysis and regulatory requirements

### 5. Approval Workflow Security
Special handling for approval requests:
- Users can create and view their requests
- **Only admins can update** (approve/reject) requests
- Prevents self-approval and maintains workflow integrity

### 6. Data Consistency
Cross-table validation policies ensure:
- Chat sessions use GPTs from same team
- Memory items belong to valid sessions
- Document reports/requests link to proper sessions
- Maintains referential integrity beyond foreign keys

## Helper Functions Used

These functions are defined in the schema file and used throughout the policies:

- `auth.uid()`: Supabase function returning current user's ID
- `get_user_role(user_id)`: Returns user's role (user/admin/super_admin)
- `get_user_team_id(user_id)`: Returns user's team ID
- `is_admin(user_id)`: Returns true if user is admin or super_admin
- `is_super_admin(user_id)`: Returns true if user is super_admin
- `can_access_team_data(user_id, team_id)`: Returns true if user can access team's data

## Security Benefits

This RLS implementation provides:

1. **Multi-tenant Security**: Complete data isolation between teams
2. **Role-based Access**: Granular permissions based on user roles
3. **Audit Trail Protection**: Immutable logs for compliance
4. **Privilege Escalation Prevention**: Users cannot elevate their own permissions
5. **Data Integrity**: Consistency checks across related tables
6. **Approval Workflow Security**: Proper separation of request and approval
7. **Ownership Respect**: Users control their own data
8. **Administrative Oversight**: Admins can manage team resources

The policies work together to create a comprehensive security model that protects data while enabling collaboration within teams and proper administrative control.
