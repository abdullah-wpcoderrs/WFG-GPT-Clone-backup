-- Row Level Security (RLS) Policies for GPT Desk Application
-- This file contains all the security policies to ensure proper data access control

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM users WHERE id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's team_id
CREATE OR REPLACE FUNCTION get_user_team_id(user_uuid UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT team_id FROM users WHERE id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role FROM users WHERE id = user_uuid) = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin or super admin
CREATE OR REPLACE FUNCTION is_admin_or_super(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role FROM users WHERE id = user_uuid) IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TEAMS TABLE POLICIES
-- =============================================

-- Super admins can see all teams
CREATE POLICY "Super admins can view all teams" ON teams
    FOR SELECT USING (is_super_admin(auth.uid()));

-- Admins and users can see their own team
CREATE POLICY "Users can view their own team" ON teams
    FOR SELECT USING (id = get_user_team_id(auth.uid()));

-- Super admins can insert teams
CREATE POLICY "Super admins can insert teams" ON teams
    FOR INSERT WITH CHECK (is_super_admin(auth.uid()));

-- Super admins can update teams
CREATE POLICY "Super admins can update teams" ON teams
    FOR UPDATE USING (is_super_admin(auth.uid()));

-- Super admins can delete teams
CREATE POLICY "Super admins can delete teams" ON teams
    FOR DELETE USING (is_super_admin(auth.uid()));

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (id = auth.uid());

-- Admins can view users in their team
CREATE POLICY "Admins can view team users" ON users
    FOR SELECT USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    );

-- Super admins can view all users
CREATE POLICY "Super admins can view all users" ON users
    FOR SELECT USING (is_super_admin(auth.uid()));

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() AND
        role = (SELECT role FROM users WHERE id = auth.uid()) AND
        team_id = (SELECT team_id FROM users WHERE id = auth.uid())
    );

-- Admins can update users in their team (limited fields)
CREATE POLICY "Admins can update team users" ON users
    FOR UPDATE USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    )
    WITH CHECK (
        team_id = get_user_team_id(auth.uid()) AND
        role != 'super_admin'
    );

-- Super admins can insert/update/delete any user
CREATE POLICY "Super admins can manage all users" ON users
    FOR ALL USING (is_super_admin(auth.uid()));

-- =============================================
-- GPTS TABLE POLICIES
-- =============================================

-- Users can view GPTs in their team or public GPTs
CREATE POLICY "Users can view team and public GPTs" ON gpts
    FOR SELECT USING (
        team_id = get_user_team_id(auth.uid()) OR 
        is_public = true OR
        is_super_admin(auth.uid())
    );

-- Users can create GPTs in their team
CREATE POLICY "Users can create team GPTs" ON gpts
    FOR INSERT WITH CHECK (
        team_id = get_user_team_id(auth.uid()) AND
        creator_id = auth.uid()
    );

-- Users can update their own GPTs
CREATE POLICY "Users can update own GPTs" ON gpts
    FOR UPDATE USING (creator_id = auth.uid())
    WITH CHECK (creator_id = auth.uid());

-- Admins can update GPTs in their team
CREATE POLICY "Admins can update team GPTs" ON gpts
    FOR UPDATE USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    );

-- Users can delete their own GPTs
CREATE POLICY "Users can delete own GPTs" ON gpts
    FOR DELETE USING (creator_id = auth.uid());

-- Admins can delete GPTs in their team
CREATE POLICY "Admins can delete team GPTs" ON gpts
    FOR DELETE USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    );

-- =============================================
-- CHAT SESSIONS TABLE POLICIES
-- =============================================

-- Users can view their own chat sessions
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR SELECT USING (user_id = auth.uid());

-- Admins can view chat sessions in their team
CREATE POLICY "Admins can view team chat sessions" ON chat_sessions
    FOR SELECT USING (
        is_admin_or_super(auth.uid()) AND 
        user_id IN (
            SELECT id FROM users WHERE team_id = get_user_team_id(auth.uid())
        )
    );

-- Users can create their own chat sessions
CREATE POLICY "Users can create own chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own chat sessions
CREATE POLICY "Users can update own chat sessions" ON chat_sessions
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own chat sessions
CREATE POLICY "Users can delete own chat sessions" ON chat_sessions
    FOR DELETE USING (user_id = auth.uid());

-- =============================================
-- CHAT MESSAGES TABLE POLICIES
-- =============================================

-- Users can view messages from their own sessions
CREATE POLICY "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM chat_sessions WHERE user_id = auth.uid()
        )
    );

-- Admins can view messages from team sessions
CREATE POLICY "Admins can view team chat messages" ON chat_messages
    FOR SELECT USING (
        is_admin_or_super(auth.uid()) AND 
        session_id IN (
            SELECT cs.id FROM chat_sessions cs
            JOIN users u ON cs.user_id = u.id
            WHERE u.team_id = get_user_team_id(auth.uid())
        )
    );

-- Users can insert messages to their own sessions
CREATE POLICY "Users can insert own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (
        session_id IN (
            SELECT id FROM chat_sessions WHERE user_id = auth.uid()
        )
    );

-- =============================================
-- DOCUMENTS TABLE POLICIES
-- =============================================

-- Users can view documents in their team
CREATE POLICY "Users can view team documents" ON documents
    FOR SELECT USING (
        team_id = get_user_team_id(auth.uid()) OR
        is_super_admin(auth.uid())
    );

-- Users can upload documents to their team
CREATE POLICY "Users can upload team documents" ON documents
    FOR INSERT WITH CHECK (
        team_id = get_user_team_id(auth.uid()) AND
        uploaded_by = auth.uid()
    );

-- Users can update their own documents
CREATE POLICY "Users can update own documents" ON documents
    FOR UPDATE USING (uploaded_by = auth.uid());

-- Admins can update team documents
CREATE POLICY "Admins can update team documents" ON documents
    FOR UPDATE USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    );

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents" ON documents
    FOR DELETE USING (uploaded_by = auth.uid());

-- Admins can delete team documents
CREATE POLICY "Admins can delete team documents" ON documents
    FOR DELETE USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    );

-- =============================================
-- TEMPLATES TABLE POLICIES
-- =============================================

-- Users can view team templates and public templates
CREATE POLICY "Users can view team and public templates" ON templates
    FOR SELECT USING (
        team_id = get_user_team_id(auth.uid()) OR 
        is_public = true OR
        is_super_admin(auth.uid())
    );

-- Users can create templates in their team
CREATE POLICY "Users can create team templates" ON templates
    FOR INSERT WITH CHECK (
        team_id = get_user_team_id(auth.uid()) AND
        created_by = auth.uid()
    );

-- Users can update their own templates
CREATE POLICY "Users can update own templates" ON templates
    FOR UPDATE USING (created_by = auth.uid());

-- Admins can update team templates
CREATE POLICY "Admins can update team templates" ON templates
    FOR UPDATE USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    );

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates" ON templates
    FOR DELETE USING (created_by = auth.uid());

-- Admins can delete team templates
CREATE POLICY "Admins can delete team templates" ON templates
    FOR DELETE USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    );

-- =============================================
-- PROJECTS TABLE POLICIES
-- =============================================

-- Users can view projects in their team
CREATE POLICY "Users can view team projects" ON projects
    FOR SELECT USING (
        team_id = get_user_team_id(auth.uid()) OR
        is_super_admin(auth.uid())
    );

-- Users can create projects in their team
CREATE POLICY "Users can create team projects" ON projects
    FOR INSERT WITH CHECK (
        team_id = get_user_team_id(auth.uid()) AND
        created_by = auth.uid()
    );

-- Users can update their own projects
CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (created_by = auth.uid());

-- Admins can update team projects
CREATE POLICY "Admins can update team projects" ON projects
    FOR UPDATE USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    );

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (created_by = auth.uid());

-- Admins can delete team projects
CREATE POLICY "Admins can delete team projects" ON projects
    FOR DELETE USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    );

-- =============================================
-- AUDIT LOGS TABLE POLICIES
-- =============================================

-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs" ON audit_logs
    FOR SELECT USING (user_id = auth.uid());

-- Admins can view team audit logs
CREATE POLICY "Admins can view team audit logs" ON audit_logs
    FOR SELECT USING (
        is_admin_or_super(auth.uid()) AND 
        user_id IN (
            SELECT id FROM users WHERE team_id = get_user_team_id(auth.uid())
        )
    );

-- System can insert audit logs (no user restrictions)
CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- =============================================
-- USAGE ANALYTICS TABLE POLICIES
-- =============================================

-- Users can view their own usage analytics
CREATE POLICY "Users can view own usage analytics" ON usage_analytics
    FOR SELECT USING (user_id = auth.uid());

-- Admins can view team usage analytics
CREATE POLICY "Admins can view team usage analytics" ON usage_analytics
    FOR SELECT USING (
        is_admin_or_super(auth.uid()) AND 
        team_id = get_user_team_id(auth.uid())
    );

-- System can insert usage analytics
CREATE POLICY "System can insert usage analytics" ON usage_analytics
    FOR INSERT WITH CHECK (true);