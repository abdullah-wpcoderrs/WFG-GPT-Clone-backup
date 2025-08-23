-- GPT Desk Comprehensive Database Schema
-- Updated to reflect current frontend implementation and requirements
-- Includes approval workflows, memory management, document contexts, and RBAC

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom enum types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE approval_type AS ENUM (
  'memory_delete',
  'memory_edit', 
  'document_context_delete',
  'document_context_edit',
  'gpt_create',
  'gpt_update',
  'gpt_delete',
  'team_create',
  'team_update',
  'team_delete'
);
CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE chat_message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE document_report_status AS ENUM ('generating', 'completed', 'failed');
CREATE TYPE document_report_format AS ENUM ('pdf', 'docx', 'txt');
CREATE TYPE document_request_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE gpt_status AS ENUM ('active', 'inactive', 'pending_approval');

-- Teams table (foundational for multi-tenancy)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 0,
  
  CONSTRAINT teams_name_check CHECK (length(name) >= 2)
);

-- Users/Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  role user_role NOT NULL DEFAULT 'user',
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}',
  
  CONSTRAINT profiles_name_check CHECK (length(name) >= 2),
  CONSTRAINT profiles_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- GPTs table
CREATE TABLE gpts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  model VARCHAR(100) NOT NULL DEFAULT 'gpt-4',
  temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 2048 CHECK (max_tokens > 0 AND max_tokens <= 32000),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status gpt_status DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  
  CONSTRAINT gpts_name_check CHECK (length(name) >= 2),
  CONSTRAINT gpts_description_check CHECK (length(description) >= 10),
  CONSTRAINT gpts_instructions_check CHECK (length(instructions) >= 20)
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status project_status DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  
  CONSTRAINT projects_name_check CHECK (length(name) >= 2)
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL CHECK (size > 0),
  url TEXT NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT documents_name_check CHECK (length(name) >= 1),
  CONSTRAINT documents_url_check CHECK (length(url) >= 10)
);

-- Chat sessions table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  gpt_id UUID NOT NULL REFERENCES gpts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT chat_sessions_title_check CHECK (length(title) >= 1)
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role chat_message_role NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER DEFAULT 0,
  
  CONSTRAINT chat_messages_content_check CHECK (length(content) >= 1)
);

-- Memory items table (for chat memory management)
CREATE TABLE memory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT memory_items_prompt_check CHECK (length(prompt) >= 1),
  CONSTRAINT memory_items_response_check CHECK (length(response) >= 1)
);

-- Document reports table
CREATE TABLE document_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  format document_report_format NOT NULL,
  status document_report_status DEFAULT 'generating',
  generated_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_url TEXT,
  
  CONSTRAINT document_reports_title_check CHECK (length(title) >= 1),
  CONSTRAINT document_reports_content_check CHECK (length(content) >= 1)
);

-- Document requests table
CREATE TABLE document_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  status document_request_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT document_requests_prompt_check CHECK (length(prompt) >= 1)
);

-- Approval requests table
CREATE TABLE approval_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type approval_type NOT NULL,
  status approval_status DEFAULT 'pending',
  requested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  details JSONB NOT NULL DEFAULT '{}',
  notes TEXT,
  
  CONSTRAINT approval_requests_review_consistency CHECK (
    (status = 'pending' AND reviewed_by IS NULL AND reviewed_at IS NULL) OR
    (status != 'pending' AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)
  )
);

-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  type VARCHAR(100) NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  
  CONSTRAINT templates_name_check CHECK (length(name) >= 2),
  CONSTRAINT templates_content_check CHECK (length(content) >= 10)
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT audit_logs_action_check CHECK (length(action) >= 2)
);

-- Usage analytics table
CREATE TABLE usage_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  gpt_id UUID REFERENCES gpts(id) ON DELETE SET NULL,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_cents INTEGER DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT usage_analytics_event_type_check CHECK (length(event_type) >= 2)
);

-- Create indexes for performance optimization
CREATE INDEX idx_profiles_team_id ON profiles(team_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

CREATE INDEX idx_gpts_team_id ON gpts(team_id);
CREATE INDEX idx_gpts_created_by ON gpts(created_by);
CREATE INDEX idx_gpts_status ON gpts(status);

CREATE INDEX idx_projects_team_id ON projects(team_id);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_status ON projects(status);

CREATE INDEX idx_documents_team_id ON documents(team_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);

CREATE INDEX idx_chat_sessions_team_id ON chat_sessions(team_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_gpt_id ON chat_sessions(gpt_id);
CREATE INDEX idx_chat_sessions_project_id ON chat_sessions(project_id);

CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

CREATE INDEX idx_memory_items_session_id ON memory_items(session_id);
CREATE INDEX idx_memory_items_user_id ON memory_items(user_id);
CREATE INDEX idx_memory_items_team_id ON memory_items(team_id);

CREATE INDEX idx_document_reports_session_id ON document_reports(session_id);
CREATE INDEX idx_document_reports_team_id ON document_reports(team_id);
CREATE INDEX idx_document_reports_status ON document_reports(status);

CREATE INDEX idx_document_requests_session_id ON document_requests(session_id);
CREATE INDEX idx_document_requests_team_id ON document_requests(team_id);
CREATE INDEX idx_document_requests_status ON document_requests(status);

CREATE INDEX idx_approval_requests_team_id ON approval_requests(team_id);
CREATE INDEX idx_approval_requests_requested_by ON approval_requests(requested_by);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_type ON approval_requests(type);

CREATE INDEX idx_templates_team_id ON templates(team_id);
CREATE INDEX idx_templates_created_by ON templates(created_by);
CREATE INDEX idx_templates_type ON templates(type);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_team_id ON audit_logs(team_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

CREATE INDEX idx_usage_analytics_team_id ON usage_analytics(team_id);
CREATE INDEX idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_created_at ON usage_analytics(created_at);
CREATE INDEX idx_usage_analytics_event_type ON usage_analytics(event_type);

-- Full-text search indexes
CREATE INDEX idx_gpts_search ON gpts USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX idx_projects_search ON projects USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_documents_search ON documents USING gin(to_tsvector('english', name));
CREATE INDEX idx_chat_messages_search ON chat_messages USING gin(to_tsvector('english', content));
CREATE INDEX idx_memory_items_search ON memory_items USING gin(to_tsvector('english', prompt || ' ' || response));

-- Create functions for business logic
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to update team member count
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE teams SET member_count = member_count + 1 WHERE id = NEW.team_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE teams SET member_count = member_count - 1 WHERE id = OLD.team_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND OLD.team_id != NEW.team_id THEN
    UPDATE teams SET member_count = member_count - 1 WHERE id = OLD.team_id;
    UPDATE teams SET member_count = member_count + 1 WHERE id = NEW.team_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create function to update chat session message count
CREATE OR REPLACE FUNCTION update_session_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE chat_sessions SET 
      message_count = message_count + 1,
      updated_at = NOW()
    WHERE id = NEW.session_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE chat_sessions SET 
      message_count = message_count - 1,
      updated_at = NOW()
    WHERE id = OLD.session_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create function to update GPT usage count
CREATE OR REPLACE FUNCTION update_gpt_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE gpts SET usage_count = usage_count + 1 WHERE id = NEW.gpt_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
  action_name TEXT;
  resource_type_name TEXT;
  user_id_val UUID;
  team_id_val UUID;
  record_data JSONB;
BEGIN
  -- Determine action based on operation
  IF TG_OP = 'INSERT' THEN
    action_name := 'CREATE';
  ELSIF TG_OP = 'UPDATE' THEN
    action_name := 'UPDATE';
  ELSIF TG_OP = 'DELETE' THEN
    action_name := 'DELETE';
  END IF;
  
  -- Extract resource type from table name
  resource_type_name := TG_TABLE_NAME;
  
  -- Get user_id and team_id based on table structure and operation
  IF TG_OP = 'DELETE' THEN
    record_data := to_jsonb(OLD);
    -- Try to extract user_id from various possible fields
    user_id_val := CASE 
      WHEN record_data ? 'user_id' THEN (record_data->>'user_id')::UUID
      WHEN record_data ? 'created_by' THEN (record_data->>'created_by')::UUID
      WHEN record_data ? 'uploaded_by' THEN (record_data->>'uploaded_by')::UUID
      WHEN record_data ? 'generated_by' THEN (record_data->>'generated_by')::UUID
      WHEN record_data ? 'requested_by' THEN (record_data->>'requested_by')::UUID
      ELSE NULL
    END;
    -- Try to extract team_id
    team_id_val := CASE 
      WHEN record_data ? 'team_id' THEN (record_data->>'team_id')::UUID
      ELSE NULL
    END;
  ELSE
    record_data := to_jsonb(NEW);
    -- Try to extract user_id from various possible fields
    user_id_val := CASE 
      WHEN record_data ? 'user_id' THEN (record_data->>'user_id')::UUID
      WHEN record_data ? 'created_by' THEN (record_data->>'created_by')::UUID
      WHEN record_data ? 'uploaded_by' THEN (record_data->>'uploaded_by')::UUID
      WHEN record_data ? 'generated_by' THEN (record_data->>'generated_by')::UUID
      WHEN record_data ? 'requested_by' THEN (record_data->>'requested_by')::UUID
      ELSE NULL
    END;
    -- Try to extract team_id
    team_id_val := CASE 
      WHEN record_data ? 'team_id' THEN (record_data->>'team_id')::UUID
      ELSE NULL
    END;
  END IF;
  
  -- Insert audit log
  INSERT INTO audit_logs (
    user_id,
    team_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    user_id_val,
    team_id_val,
    action_name,
    resource_type_name,
    CASE 
      WHEN record_data ? 'id' THEN (record_data->>'id')::UUID
      ELSE NULL
    END,
    record_data
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gpts_updated_at BEFORE UPDATE ON gpts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memory_items_updated_at BEFORE UPDATE ON memory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_reports_updated_at BEFORE UPDATE ON document_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_requests_updated_at BEFORE UPDATE ON document_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for business logic
CREATE TRIGGER update_team_member_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_team_member_count();

CREATE TRIGGER update_session_message_count_trigger
  AFTER INSERT OR DELETE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_session_message_count();

CREATE TRIGGER update_gpt_usage_count_trigger
  AFTER INSERT ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_gpt_usage_count();

-- Create audit triggers for important tables
CREATE TRIGGER audit_gpts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON gpts
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_projects_trigger
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_documents_trigger
  AFTER INSERT OR UPDATE OR DELETE ON documents
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_approval_requests_trigger
  AFTER INSERT OR UPDATE OR DELETE ON approval_requests
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_memory_items_trigger
  AFTER INSERT OR UPDATE OR DELETE ON memory_items
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Create helper functions for RLS policies
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_team_id(user_id UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT team_id FROM profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role IN ('admin', 'super_admin') FROM profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'super_admin' FROM profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION can_access_team_data(user_id UUID, target_team_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Super admins can access all team data
  IF is_super_admin(user_id) THEN
    RETURN true;
  END IF;
  
  -- Regular users and admins can only access their own team's data
  RETURN get_user_team_id(user_id) = target_team_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE teams IS 'Teams provide multi-tenant data isolation';
COMMENT ON TABLE profiles IS 'User profiles with role-based access control';
COMMENT ON TABLE gpts IS 'AI assistant configurations with team isolation';
COMMENT ON TABLE projects IS 'Project organization within teams';
COMMENT ON TABLE documents IS 'File storage and management';
COMMENT ON TABLE chat_sessions IS 'Chat conversation management';
COMMENT ON TABLE chat_messages IS 'Individual chat messages';
COMMENT ON TABLE memory_items IS 'Chat memory storage for learning';
COMMENT ON TABLE document_reports IS 'Generated document tracking';
COMMENT ON TABLE document_requests IS 'Document generation requests';
COMMENT ON TABLE approval_requests IS 'Workflow approval management';
COMMENT ON TABLE templates IS 'Reusable content templates';
COMMENT ON TABLE audit_logs IS 'Security and compliance tracking';
COMMENT ON TABLE usage_analytics IS 'Platform usage metrics';

COMMENT ON FUNCTION get_user_role(UUID) IS 'Helper function to get user role for RLS';
COMMENT ON FUNCTION get_user_team_id(UUID) IS 'Helper function to get user team ID for RLS';
COMMENT ON FUNCTION is_admin(UUID) IS 'Helper function to check admin status for RLS';
COMMENT ON FUNCTION is_super_admin(UUID) IS 'Helper function to check super admin status for RLS';
COMMENT ON FUNCTION can_access_team_data(UUID, UUID) IS 'Helper function to validate team data access for RLS';
