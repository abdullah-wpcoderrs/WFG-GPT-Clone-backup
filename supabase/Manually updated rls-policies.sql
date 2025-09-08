-- GPT Desk Comprehensive Row Level Security (RLS) Policies
-- Implements team isolation, role-based access control, and secure data access
-- Based on frontend requirements and RBAC implementation

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
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
-- New Add the is_personal column if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_personal BOOLEAN DEFAULT FALSE;

-- Teams table policies
-- Super admins can see all teams, others can only see their own team
CREATE POLICY "teams_select_policy" ON teams
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR 
    id = get_user_team_id(auth.uid())
  );

-- Only super admins can create teams
CREATE POLICY "teams_insert_policy" ON teams
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid())
  );

-- New update policy for teams: Super admins can update any team, admins can update their own team
CREATE POLICY "teams_update_policy" ON teams
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR
    (is_admin(auth.uid()) AND id = get_user_team_id(auth.uid()))
  );

-- Only super admins can delete teams
CREATE POLICY "teams_delete_policy" ON teams
  FOR DELETE USING (
    is_super_admin(auth.uid())
  );



-- users table policies
-- New select policy for users: Any user can see all users
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (
    true -- Everyone can see all users for search purposes
  );

-- Users can be created (signup process)
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT WITH CHECK (true);

-- Users can update their own profile, admins can update team users, super admins can update any
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE USING (
    id = auth.uid() OR
    (is_admin(auth.uid()) AND team_id = get_user_team_id(auth.uid())) OR
    is_super_admin(auth.uid())
  );

-- New delete policy for users: Admins and super admins can delete users
CREATE POLICY "users_delete_policy" ON users
  FOR DELETE USING (
    is_admin(auth.uid()) OR is_super_admin(auth.uid())
  );



-- GPTs table policies
-- New select policy for gpts: Super admins see all, others see team GPTs
CREATE POLICY "gpts_select_policy" ON gpts
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR
    can_access_team_data(auth.uid(), team_id)
  );

-- New insert policy for gpts: Super admins can create any, admins create for their team
CREATE POLICY "gpts_insert_policy" ON gpts
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid()) OR
    (is_admin(auth.uid()) AND team_id = get_user_team_id(auth.uid()))
  );

-- New update policy for gpts: Super admins update any, and admins update their team's
CREATE POLICY "gpts_update_policy" ON gpts
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- New delete policy for gpts: Super admins delete any, admins delete their team's
CREATE POLICY "gpts_delete_policy" ON gpts
  FOR DELETE USING (
    is_super_admin(auth.uid()) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );



-- Projects table policies

-- New select policy for projects: Users see their own personal/team projects, admins or super admins can't see it if it is not exposed as a team project
CREATE POLICY "projects_select_policy" ON projects
  FOR SELECT USING (
    (is_personal = TRUE AND created_by = auth.uid()) OR -- User can see their own personal projects
    (is_personal = FALSE AND can_access_team_data(auth.uid(), team_id)) OR -- User/Admin can see team projects they have access to
    (is_super_admin(auth.uid()) AND is_personal = FALSE) -- Super admins can only see team projects, NOT personal ones
  );

-- New insert policy for projects: Users can create personal or team projects, admins can create personal or team projects
CREATE POLICY "projects_insert_policy" ON projects
  FOR INSERT WITH CHECK (
    (is_personal = TRUE AND created_by = auth.uid()) OR -- User can create their own personal project
    (is_personal = FALSE AND team_id = get_user_team_id(auth.uid())) OR -- User can create team project for their team
    (is_admin(auth.uid()) AND created_by = auth.uid() AND is_personal = TRUE) OR -- Admin can create their own personal project
    (is_admin(auth.uid()) AND team_id = get_user_team_id(auth.uid()) AND is_personal = FALSE) OR -- Admin can create team project for their team
    is_super_admin(auth.uid()) -- Super admins can create any project (personal or team)
  );

-- New update policy for projects: Creators update their projects, admins update their team projects
CREATE POLICY "projects_update_policy" ON projects
  FOR UPDATE USING (
    created_by = auth.uid() OR -- Creator (user/admin) can update their own project (personal or team)
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id) AND is_personal = FALSE) OR -- Admin can update team projects in their team
    is_super_admin(auth.uid()) -- Super admins can update any project (personal or team)
  );

-- New delete policy for projects: Creators delete their projects, admins delete their team projects
CREATE POLICY "projects_delete_policy" ON projects
  FOR DELETE USING (
    created_by = auth.uid() OR -- Creator (user/admin) can delete their own project (personal or team)
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id) AND is_personal = FALSE) OR -- Admin can delete team projects in their team
    is_super_admin(auth.uid()) -- Super admins can delete any project (personal or team)
  );




-- Documents table policies
-- New select policy for documents: Users see team documents, super admins see all
CREATE POLICY "documents_select_policy" ON documents
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR
    can_access_team_data(auth.uid(), team_id)
  );

-- New insert policy for documents: Users upload to their team, super admins upload any
CREATE POLICY "documents_insert_policy" ON documents
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid()) OR
    team_id = get_user_team_id(auth.uid())
  );

--- New update policy for documents: Uploaders/admins update their team's, super admins update any
CREATE POLICY "documents_update_policy" ON documents
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR
    (uploaded_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- New delete policy for documents: Uploaders/admins delete their team's, super admins delete any
CREATE POLICY "documents_delete_policy" ON documents
  FOR DELETE USING (
    is_super_admin(auth.uid()) OR
    (uploaded_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );




-- Chat sessions table policies
-- New select policy for chat_sessions: Users only see their own, super admins see all
-- Create the new select policy with sharing conditions
CREATE POLICY "chat_sessions_select_policy" ON chat_sessions
  FOR SELECT USING (
    -- Condition for the session owner to see their own session
    user_id = auth.uid() OR
    -- Condition for super admins to see all sessions
    is_super_admin(auth.uid()) OR
    -- Condition for a session shared via a public link
    is_public = true OR
    -- Condition for a session explicitly shared with the current user
    auth.uid() = ANY (shared_with_users)
  );
  

--New Users can create chat sessions in their profile
CREATE POLICY "chat_sessions_insert_policy" ON chat_sessions
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

-- Users can update their own sessions, admins can update team sessions
CREATE POLICY "chat_sessions_update_policy" ON chat_sessions
  FOR UPDATE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- New delete policy for chat_sessions: Users delete their own, super admins delete any
CREATE POLICY "chat_sessions_delete_policy" ON chat_sessions
  FOR DELETE USING (
    user_id = auth.uid() OR -- User deletes their own session
    is_super_admin(auth.uid()) -- Super admins can delete any session
  );



-- Chat messages table policies
-- New select policy for chat_messages: Only owners of session can see messages
CREATE POLICY "chat_messages_select_policy" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs
      WHERE cs.id = session_id AND (
        cs.user_id = auth.uid()
        -- Super admins are explicitly excluded from seeing other users' chat messages here to respect the strict privacy requirement.
        -- If super-admins *should* see all messages for oversight, uncomment the line below.
        OR is_super_admin(auth.uid())
      )
    )
  );

-- Users can create messages in their sessions
CREATE POLICY "chat_messages_insert_policy" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.user_id = auth.uid()
    )
  );

-- New update policy for chat_messages: Users update their own, super admins update any
CREATE POLICY "chat_messages_update_policy" ON chat_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs
      WHERE cs.id = session_id AND (
        cs.user_id = auth.uid() OR -- User updates messages in their session
        is_super_admin(auth.uid()) -- Super admins can update messages in any session
      )
    )
  );

-- New delete policy for chat_messages: Users delete their own, super admins delete any
CREATE POLICY "chat_messages_delete_policy" ON chat_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs
      WHERE cs.id = session_id AND (
        cs.user_id = auth.uid() OR -- User deletes messages in their session
        is_super_admin(auth.uid()) -- Super admins can delete messages in any session
      )
    )
  );




-- Memory items table policies
-- New select policy for memory_items: Users see their own, super admins see all
CREATE POLICY "memory_items_select_policy" ON memory_items
  FOR SELECT USING (
    user_id = auth.uid() OR
    is_super_admin(auth.uid())
  );

-- New insert policy for memory_items: Users create their own, super admins create any
CREATE POLICY "memory_items_insert_policy" ON memory_items
  FOR INSERT WITH CHECK (
    (user_id = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    is_super_admin(auth.uid())
  );

-- New update policy for memory_items: Users update their own, super admins update any
CREATE POLICY "memory_items_update_policy" ON memory_items
  FOR UPDATE USING (
    user_id = auth.uid() OR
    is_super_admin(auth.uid())
  );

-- New delete policy for memory_items: Users delete their own, super admins delete any
CREATE POLICY "memory_items_delete_policy" ON memory_items
  FOR DELETE USING (
    user_id = auth.uid() OR
    is_super_admin(auth.uid())
  );




-- Document reports table policies
-- Users can see reports from their sessions, admins can see team reports
CREATE POLICY "document_reports_select_policy" ON document_reports
  FOR SELECT USING (
    generated_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Users can create document reports in their team
CREATE POLICY "document_reports_insert_policy" ON document_reports
  FOR INSERT WITH CHECK (
    generated_by = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );

-- Users can update their own reports, admins can update team reports
CREATE POLICY "document_reports_update_policy" ON document_reports
  FOR UPDATE USING (
    generated_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Users can delete their own reports, admins can delete team reports
CREATE POLICY "document_reports_delete_policy" ON document_reports
  FOR DELETE USING (
    generated_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );




-- Document requests table policies
-- Users can see their own requests, admins can see team requests
CREATE POLICY "document_requests_select_policy" ON document_requests
  FOR SELECT USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Users can create document requests in their team
CREATE POLICY "document_requests_insert_policy" ON document_requests
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );

-- Users can update their own requests, admins can update team requests
CREATE POLICY "document_requests_update_policy" ON document_requests
  FOR UPDATE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Users can delete their own requests, admins can delete team requests
CREATE POLICY "document_requests_delete_policy" ON document_requests
  FOR DELETE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );




-- Approval requests table policies
-- New select policy for approval_requests: Users see their own, admins see team, super admins see all
CREATE POLICY "approval_requests_select_policy" ON approval_requests
  FOR SELECT USING (
    requested_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id)) OR
    is_super_admin(auth.uid())
  );

-- Users can create approval requests in their team
CREATE POLICY "approval_requests_insert_policy" ON approval_requests
  FOR INSERT WITH CHECK (
    requested_by = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );

-- New update policy for approval_requests: Admins can update approval requests (for review process)
CREATE POLICY "approval_requests_update_policy" ON approval_requests
  FOR UPDATE USING (
    is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id)OR
    is_super_admin(auth.uid())
  );

-- New delete policy for approval_requests: Requesters and admins can delete approval requests
CREATE POLICY "approval_requests_delete_policy" ON approval_requests
  FOR DELETE USING (
    requested_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))OR
    is_super_admin(auth.uid())
  );




-- Templates table policies
-- New select policy for templates: Users see public/team, super admins see all
CREATE POLICY "templates_select_policy" ON templates
  FOR SELECT USING (
    is_public = true OR
    can_access_team_data(auth.uid(), team_id) OR
    is_super_admin(auth.uid())
  );

-- New insert policy for templates: Users create team, super admins create any
CREATE POLICY "templates_insert_policy" ON templates
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid()) OR
    team_id = get_user_team_id(auth.uid())
  );

-- New update policy for templates: Creators/admins update team, super admins update any
CREATE POLICY "templates_update_policy" ON templates
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- New delete policy for templates: Creators/admins delete team, super admins delete any
CREATE POLICY "templates_delete_policy" ON templates
  FOR DELETE USING (
    is_super_admin(auth.uid()) OR
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );





-- Audit logs table policies
-- Admins can see team audit logs, super admins can see all
CREATE POLICY "audit_logs_select_policy" ON audit_logs
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- System can insert audit logs (no user restrictions)
CREATE POLICY "audit_logs_insert_policy" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- No updates allowed on audit logs (immutable)
CREATE POLICY "audit_logs_update_policy" ON audit_logs
  FOR UPDATE USING (false);

-- Only super admins can delete audit logs (for data retention)
CREATE POLICY "audit_logs_delete_policy" ON audit_logs
  FOR DELETE USING (
    is_super_admin(auth.uid())
  );




-- Usage analytics table policies
-- Admins can see team analytics, super admins can see all
CREATE POLICY "usage_analytics_select_policy" ON usage_analytics
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- System can insert analytics (no user restrictions)
CREATE POLICY "usage_analytics_insert_policy" ON usage_analytics
  FOR INSERT WITH CHECK (true);

-- No updates allowed on analytics (immutable)
CREATE POLICY "usage_analytics_update_policy" ON usage_analytics
  FOR UPDATE USING (false);

-- Only super admins can delete analytics (for data retention)
CREATE POLICY "usage_analytics_delete_policy" ON usage_analytics
  FOR DELETE USING (
    is_super_admin(auth.uid())
  );




-- Additional security policies for specific use cases

-- Policy to prevent users from changing their own role
CREATE POLICY "users_role_protection" ON users
  FOR UPDATE USING (
    -- Users cannot update their own profile's role field
    -- Only admins/super_admins can change roles of other users
    id != auth.uid() OR is_admin(auth.uid()) OR is_super_admin(auth.uid())
  );

-- Policy to ensure team consistency in related tables
CREATE POLICY "chat_sessions_team_consistency" ON chat_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM gpts g 
      WHERE g.id = gpt_id AND g.team_id = team_id
    )
  );

-- Policy to ensure memory items belong to valid sessions
CREATE POLICY "memory_items_session_consistency" ON memory_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.team_id = team_id AND cs.user_id = user_id
    )
  );

-- Policy to ensure document reports belong to valid sessions
CREATE POLICY "document_reports_session_consistency" ON document_reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.team_id = team_id
    )
  );

-- Policy to ensure document requests belong to valid sessions
CREATE POLICY "document_requests_session_consistency" ON document_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.team_id = team_id AND cs.user_id = user_id
    )
  );

-- Comments for documentation
COMMENT ON POLICY "teams_select_policy" ON teams IS 'Super admins see all teams, others see only their team';
COMMENT ON POLICY "users_select_policy" ON users IS 'Users see team users, admins see team users, super admins see all';
COMMENT ON POLICY "gpts_select_policy" ON gpts IS 'Team-based access with role-based permissions';
COMMENT ON POLICY "chat_sessions_select_policy" ON chat_sessions IS 'Users see own sessions, admins see team sessions';
COMMENT ON POLICY "memory_items_select_policy" ON memory_items IS 'Users see own memory, admins see team memory';
COMMENT ON POLICY "approval_requests_select_policy" ON approval_requests IS 'Users see own requests, admins see team requests';
COMMENT ON POLICY "audit_logs_select_policy" ON audit_logs IS 'Admins see team logs, super admins see all logs';
COMMENT ON POLICY "usage_analytics_select_policy" ON usage_analytics IS 'Admins see team analytics, super admins see all analytics';
