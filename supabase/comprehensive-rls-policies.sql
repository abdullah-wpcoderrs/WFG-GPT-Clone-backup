-- GPT Desk Comprehensive Row Level Security (RLS) Policies
-- Implements team isolation, role-based access control, and secure data access
-- Based on frontend requirements and RBAC implementation

-- Enable RLS on all tables
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

-- Only super admins can update teams
CREATE POLICY "teams_update_policy" ON teams
  FOR UPDATE USING (
    is_super_admin(auth.uid())
  );

-- Only super admins can delete teams
CREATE POLICY "teams_delete_policy" ON teams
  FOR DELETE USING (
    is_super_admin(auth.uid())
  );

-- Profiles table policies
-- Users can see profiles in their team, admins can see team profiles, super admins see all
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR
    team_id = get_user_team_id(auth.uid())
  );

-- Users can be created (signup process)
CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (true);

-- Users can update their own profile, admins can update team profiles, super admins can update any
CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (
    id = auth.uid() OR
    (is_admin(auth.uid()) AND team_id = get_user_team_id(auth.uid())) OR
    is_super_admin(auth.uid())
  );

-- Only super admins can delete profiles
CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE USING (
    is_super_admin(auth.uid())
  );

-- GPTs table policies
-- Users can see GPTs in their team
CREATE POLICY "gpts_select_policy" ON gpts
  FOR SELECT USING (
    can_access_team_data(auth.uid(), team_id)
  );

-- Admins and super admins can create GPTs
CREATE POLICY "gpts_insert_policy" ON gpts
  FOR INSERT WITH CHECK (
    is_admin(auth.uid()) AND
    team_id = get_user_team_id(auth.uid())
  );

-- Creators and admins can update GPTs in their team
CREATE POLICY "gpts_update_policy" ON gpts
  FOR UPDATE USING (
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Admins can delete GPTs in their team
CREATE POLICY "gpts_delete_policy" ON gpts
  FOR DELETE USING (
    is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id)
  );

-- Projects table policies
-- Users can see projects in their team
CREATE POLICY "projects_select_policy" ON projects
  FOR SELECT USING (
    can_access_team_data(auth.uid(), team_id)
  );

-- Users can create projects in their team
CREATE POLICY "projects_insert_policy" ON projects
  FOR INSERT WITH CHECK (
    team_id = get_user_team_id(auth.uid())
  );

-- Creators and admins can update projects
CREATE POLICY "projects_update_policy" ON projects
  FOR UPDATE USING (
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Creators and admins can delete projects
CREATE POLICY "projects_delete_policy" ON projects
  FOR DELETE USING (
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Documents table policies
-- Users can see documents in their team
CREATE POLICY "documents_select_policy" ON documents
  FOR SELECT USING (
    can_access_team_data(auth.uid(), team_id)
  );

-- Users can upload documents to their team
CREATE POLICY "documents_insert_policy" ON documents
  FOR INSERT WITH CHECK (
    team_id = get_user_team_id(auth.uid())
  );

-- Uploaders and admins can update documents
CREATE POLICY "documents_update_policy" ON documents
  FOR UPDATE USING (
    (uploaded_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Uploaders and admins can delete documents
CREATE POLICY "documents_delete_policy" ON documents
  FOR DELETE USING (
    (uploaded_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Chat sessions table policies
-- Users can see their own chat sessions and team sessions if admin
CREATE POLICY "chat_sessions_select_policy" ON chat_sessions
  FOR SELECT USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Users can create chat sessions in their team
CREATE POLICY "chat_sessions_insert_policy" ON chat_sessions
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );

-- Users can update their own sessions, admins can update team sessions
CREATE POLICY "chat_sessions_update_policy" ON chat_sessions
  FOR UPDATE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Users can delete their own sessions, admins can delete team sessions
CREATE POLICY "chat_sessions_delete_policy" ON chat_sessions
  FOR DELETE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Chat messages table policies
-- Users can see messages from their sessions or team sessions if admin
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

-- Users can create messages in their sessions
CREATE POLICY "chat_messages_insert_policy" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.user_id = auth.uid()
    )
  );

-- Users can update their own messages, admins can update team messages
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

-- Users can delete their own messages, admins can delete team messages
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

-- Memory items table policies
-- Users can see their own memory items, admins can see team memory items
CREATE POLICY "memory_items_select_policy" ON memory_items
  FOR SELECT USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Users can create memory items in their team
CREATE POLICY "memory_items_insert_policy" ON memory_items
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );

-- Users can update their own memory items, admins can update team memory items
CREATE POLICY "memory_items_update_policy" ON memory_items
  FOR UPDATE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Users can delete their own memory items, admins can delete team memory items
CREATE POLICY "memory_items_delete_policy" ON memory_items
  FOR DELETE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
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
-- Users can see their own requests, admins can see team requests
CREATE POLICY "approval_requests_select_policy" ON approval_requests
  FOR SELECT USING (
    requested_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Users can create approval requests in their team
CREATE POLICY "approval_requests_insert_policy" ON approval_requests
  FOR INSERT WITH CHECK (
    requested_by = auth.uid() AND
    team_id = get_user_team_id(auth.uid())
  );

-- Only admins can update approval requests (for review process)
CREATE POLICY "approval_requests_update_policy" ON approval_requests
  FOR UPDATE USING (
    is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id)
  );

-- Requesters and admins can delete approval requests
CREATE POLICY "approval_requests_delete_policy" ON approval_requests
  FOR DELETE USING (
    requested_by = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Templates table policies
-- Users can see public templates and team templates
CREATE POLICY "templates_select_policy" ON templates
  FOR SELECT USING (
    is_public = true OR
    can_access_team_data(auth.uid(), team_id)
  );

-- Users can create templates in their team
CREATE POLICY "templates_insert_policy" ON templates
  FOR INSERT WITH CHECK (
    team_id = get_user_team_id(auth.uid())
  );

-- Creators and admins can update templates
CREATE POLICY "templates_update_policy" ON templates
  FOR UPDATE USING (
    (created_by = auth.uid() AND team_id = get_user_team_id(auth.uid())) OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id))
  );

-- Creators and admins can delete templates
CREATE POLICY "templates_delete_policy" ON templates
  FOR DELETE USING (
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
CREATE POLICY "profiles_role_protection" ON profiles
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
COMMENT ON POLICY "profiles_select_policy" ON profiles IS 'Users see team profiles, admins see team profiles, super admins see all';
COMMENT ON POLICY "gpts_select_policy" ON gpts IS 'Team-based access with role-based permissions';
COMMENT ON POLICY "chat_sessions_select_policy" ON chat_sessions IS 'Users see own sessions, admins see team sessions';
COMMENT ON POLICY "memory_items_select_policy" ON memory_items IS 'Users see own memory, admins see team memory';
COMMENT ON POLICY "approval_requests_select_policy" ON approval_requests IS 'Users see own requests, admins see team requests';
COMMENT ON POLICY "audit_logs_select_policy" ON audit_logs IS 'Admins see team logs, super admins see all logs';
COMMENT ON POLICY "usage_analytics_select_policy" ON usage_analytics IS 'Admins see team analytics, super admins see all analytics';
