-- Phase 3: Row Level Security (RLS) Policies for Vector Tables
-- This file adds RLS policies for all new vector-related tables

-- Enable RLS on all new tables
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpt_context_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE internet_search_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_context_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_memory_items ENABLE ROW LEVEL SECURITY;

-- Document chunks policies
-- Users can see chunks from documents they have access to
CREATE POLICY "document_chunks_select_policy" ON document_chunks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents d 
      WHERE d.id = document_id 
      AND (
        is_super_admin(auth.uid()) OR
        can_access_team_data(auth.uid(), d.team_id)
      )
    )
  );

-- System can insert chunks (usually via functions)
CREATE POLICY "document_chunks_insert_policy" ON document_chunks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM documents d 
      WHERE d.id = document_id 
      AND (
        is_super_admin(auth.uid()) OR
        can_access_team_data(auth.uid(), d.team_id)
      )
    )
  );

-- Users can update chunks from their team's documents
CREATE POLICY "document_chunks_update_policy" ON document_chunks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM documents d 
      WHERE d.id = document_id 
      AND (
        is_super_admin(auth.uid()) OR
        (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), d.team_id))
      )
    )
  );

-- Users can delete chunks from their team's documents
CREATE POLICY "document_chunks_delete_policy" ON document_chunks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM documents d 
      WHERE d.id = document_id 
      AND (
        is_super_admin(auth.uid()) OR
        (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), d.team_id))
      )
    )
  );

-- Document embeddings policies
-- Users can see embeddings for chunks they have access to
CREATE POLICY "document_embeddings_select_policy" ON document_embeddings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM document_chunks dc
      JOIN documents d ON dc.document_id = d.id
      WHERE dc.id = chunk_id 
      AND (
        is_super_admin(auth.uid()) OR
        can_access_team_data(auth.uid(), d.team_id)
      )
    )
  );

-- System can insert embeddings
CREATE POLICY "document_embeddings_insert_policy" ON document_embeddings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM document_chunks dc
      JOIN documents d ON dc.document_id = d.id
      WHERE dc.id = chunk_id 
      AND (
        is_super_admin(auth.uid()) OR
        can_access_team_data(auth.uid(), d.team_id)
      )
    )
  );

-- Users can update embeddings for their team's documents
CREATE POLICY "document_embeddings_update_policy" ON document_embeddings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM document_chunks dc
      JOIN documents d ON dc.document_id = d.id
      WHERE dc.id = chunk_id 
      AND (
        is_super_admin(auth.uid()) OR
        (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), d.team_id))
      )
    )
  );

-- Users can delete embeddings for their team's documents
CREATE POLICY "document_embeddings_delete_policy" ON document_embeddings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM document_chunks dc
      JOIN documents d ON dc.document_id = d.id
      WHERE dc.id = chunk_id 
      AND (
        is_super_admin(auth.uid()) OR
        (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), d.team_id))
      )
    )
  );

-- GPT context documents policies
-- Users can see context documents for GPTs they have access to
CREATE POLICY "gpt_context_documents_select_policy" ON gpt_context_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM gpts g 
      WHERE g.id = gpt_id 
      AND (
        is_super_admin(auth.uid()) OR
        can_access_team_data(auth.uid(), g.team_id)
      )
    )
  );

-- Users can add documents to their team's GPTs
CREATE POLICY "gpt_context_documents_insert_policy" ON gpt_context_documents
  FOR INSERT WITH CHECK (
    added_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM gpts g 
      WHERE g.id = gpt_id 
      AND (
        is_super_admin(auth.uid()) OR
        can_access_team_data(auth.uid(), g.team_id)
      )
    ) AND
    EXISTS (
      SELECT 1 FROM documents d 
      WHERE d.id = document_id 
      AND (
        is_super_admin(auth.uid()) OR
        can_access_team_data(auth.uid(), d.team_id)
      )
    )
  );

-- Users can update their own additions or admins can update team context
CREATE POLICY "gpt_context_documents_update_policy" ON gpt_context_documents
  FOR UPDATE USING (
    (added_by = auth.uid()) OR
    (is_admin(auth.uid()) AND EXISTS (
      SELECT 1 FROM gpts g 
      WHERE g.id = gpt_id 
      AND can_access_team_data(auth.uid(), g.team_id)
    )) OR
    is_super_admin(auth.uid())
  );

-- Users can delete their own additions or admins can delete team context
CREATE POLICY "gpt_context_documents_delete_policy" ON gpt_context_documents
  FOR DELETE USING (
    (added_by = auth.uid()) OR
    (is_admin(auth.uid()) AND EXISTS (
      SELECT 1 FROM gpts g 
      WHERE g.id = gpt_id 
      AND can_access_team_data(auth.uid(), g.team_id)
    )) OR
    is_super_admin(auth.uid())
  );

-- Internet search cache policies
-- All authenticated users can read cache (for performance)
CREATE POLICY "internet_search_cache_select_policy" ON internet_search_cache
  FOR SELECT USING (auth.role() = 'authenticated');

-- System can insert cache entries
CREATE POLICY "internet_search_cache_insert_policy" ON internet_search_cache
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- System can update cache entries
CREATE POLICY "internet_search_cache_update_policy" ON internet_search_cache
  FOR UPDATE USING (auth.role() = 'authenticated');

-- System can delete expired cache entries
CREATE POLICY "internet_search_cache_delete_policy" ON internet_search_cache
  FOR DELETE USING (
    expires_at < NOW() OR 
    is_super_admin(auth.uid())
  );

-- Chat context windows policies
-- Users can see context for their own sessions
CREATE POLICY "chat_context_windows_select_policy" ON chat_context_windows
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs
      WHERE cs.id = session_id AND (
        cs.user_id = auth.uid() OR
        is_super_admin(auth.uid())
      )
    )
  );

-- Users can create context for their own sessions
CREATE POLICY "chat_context_windows_insert_policy" ON chat_context_windows
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.user_id = auth.uid()
    )
  );

-- Users can update context for their own sessions
CREATE POLICY "chat_context_windows_update_policy" ON chat_context_windows
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs
      WHERE cs.id = session_id AND (
        cs.user_id = auth.uid() OR
        is_super_admin(auth.uid())
      )
    )
  );

-- Users can delete context for their own sessions
CREATE POLICY "chat_context_windows_delete_policy" ON chat_context_windows
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs
      WHERE cs.id = session_id AND (
        cs.user_id = auth.uid() OR
        is_super_admin(auth.uid())
      )
    )
  );

-- PDF generation jobs policies
-- Users can see their own PDF jobs, admins can see team jobs
CREATE POLICY "pdf_generation_jobs_select_policy" ON pdf_generation_jobs
  FOR SELECT USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id)) OR
    is_super_admin(auth.uid())
  );

-- Users can create PDF jobs in their team
CREATE POLICY "pdf_generation_jobs_insert_policy" ON pdf_generation_jobs
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    team_id = get_user_team_id(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.user_id = auth.uid()
    )
  );

-- System and admins can update PDF job status
CREATE POLICY "pdf_generation_jobs_update_policy" ON pdf_generation_jobs
  FOR UPDATE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id)) OR
    is_super_admin(auth.uid())
  );

-- Users can delete their own jobs, admins can delete team jobs
CREATE POLICY "pdf_generation_jobs_delete_policy" ON pdf_generation_jobs
  FOR DELETE USING (
    user_id = auth.uid() OR
    (is_admin(auth.uid()) AND can_access_team_data(auth.uid(), team_id)) OR
    is_super_admin(auth.uid())
  );

-- Enhanced memory items policies
-- Users can see their own memory, super admins can see all
CREATE POLICY "enhanced_memory_items_select_policy" ON enhanced_memory_items
  FOR SELECT USING (
    user_id = auth.uid() OR
    is_super_admin(auth.uid())
  );

-- Users can create memory items for their own sessions
CREATE POLICY "enhanced_memory_items_insert_policy" ON enhanced_memory_items
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    team_id = get_user_team_id(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id AND cs.user_id = auth.uid()
    )
  );

-- Users can update their own memory items
CREATE POLICY "enhanced_memory_items_update_policy" ON enhanced_memory_items
  FOR UPDATE USING (
    user_id = auth.uid() OR
    is_super_admin(auth.uid())
  );

-- Users can delete their own memory items
CREATE POLICY "enhanced_memory_items_delete_policy" ON enhanced_memory_items
  FOR DELETE USING (
    user_id = auth.uid() OR
    is_super_admin(auth.uid())
  );

-- Additional security policies

-- Ensure documents added to GPT context belong to the same team
CREATE POLICY "gpt_context_team_consistency" ON gpt_context_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM gpts g, documents d
      WHERE g.id = gpt_id 
      AND d.id = document_id 
      AND g.team_id = d.team_id
    )
  );

-- Ensure PDF jobs reference valid sessions
CREATE POLICY "pdf_jobs_session_consistency" ON pdf_generation_jobs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id 
      AND cs.team_id = team_id 
      AND cs.user_id = user_id
    )
  );

-- Ensure memory items reference valid sessions
CREATE POLICY "memory_items_session_consistency" ON enhanced_memory_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id 
      AND cs.team_id = team_id 
      AND cs.user_id = user_id
    )
  );

-- Ensure context windows reference valid sessions
CREATE POLICY "context_windows_session_consistency" ON chat_context_windows
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs 
      WHERE cs.id = session_id
    )
  );

-- Comments for documentation
COMMENT ON POLICY "document_chunks_select_policy" ON document_chunks IS 'Users see chunks from accessible documents';
COMMENT ON POLICY "document_embeddings_select_policy" ON document_embeddings IS 'Users see embeddings for accessible document chunks';
COMMENT ON POLICY "gpt_context_documents_select_policy" ON gpt_context_documents IS 'Users see context documents for accessible GPTs';
COMMENT ON POLICY "internet_search_cache_select_policy" ON internet_search_cache IS 'All authenticated users can read cache for performance';
COMMENT ON POLICY "chat_context_windows_select_policy" ON chat_context_windows IS 'Users see context for their own chat sessions';
COMMENT ON POLICY "pdf_generation_jobs_select_policy" ON pdf_generation_jobs IS 'Users see their own PDF jobs, admins see team jobs';
COMMENT ON POLICY "enhanced_memory_items_select_policy" ON enhanced_memory_items IS 'Users see their own memory items, super admins see all';

-- Additional constraints for data integrity
ALTER TABLE document_chunks ADD CONSTRAINT fk_document_chunks_document 
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;

ALTER TABLE document_embeddings ADD CONSTRAINT fk_document_embeddings_chunk 
  FOREIGN KEY (chunk_id) REFERENCES document_chunks(id) ON DELETE CASCADE;

ALTER TABLE gpt_context_documents ADD CONSTRAINT fk_gpt_context_gpt 
  FOREIGN KEY (gpt_id) REFERENCES gpts(id) ON DELETE CASCADE;

ALTER TABLE gpt_context_documents ADD CONSTRAINT fk_gpt_context_document 
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;

ALTER TABLE chat_context_windows ADD CONSTRAINT fk_context_windows_session 
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE;

ALTER TABLE pdf_generation_jobs ADD CONSTRAINT fk_pdf_jobs_session 
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE;

ALTER TABLE enhanced_memory_items ADD CONSTRAINT fk_enhanced_memory_session 
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE;