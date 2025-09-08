-- Phase 2: Vector Operations and Business Logic Functions
-- This file contains all the database functions needed for vector operations

-- Function to chunk a document into smaller pieces
CREATE OR REPLACE FUNCTION chunk_document(
    p_document_id UUID,
    p_content TEXT,
    p_chunk_size INTEGER DEFAULT 1000,
    p_overlap INTEGER DEFAULT 200
)
RETURNS INTEGER AS $$
DECLARE
    chunk_count INTEGER := 0;
    chunk_start INTEGER := 1;
    chunk_end INTEGER;
    current_chunk TEXT;
    word_count INTEGER;
    char_count INTEGER;
BEGIN
    -- Clear existing chunks for this document
    DELETE FROM document_chunks WHERE document_id = p_document_id;
    DELETE FROM document_embeddings WHERE chunk_id IN (
        SELECT id FROM document_chunks WHERE document_id = p_document_id
    );
    
    -- Split content into chunks
    WHILE chunk_start <= length(p_content) LOOP
        chunk_end := LEAST(chunk_start + p_chunk_size - 1, length(p_content));
        
        -- Try to break at word boundaries
        IF chunk_end < length(p_content) THEN
            WHILE chunk_end > chunk_start AND substring(p_content, chunk_end, 1) != ' ' LOOP
                chunk_end := chunk_end - 1;
            END LOOP;
        END IF;
        
        current_chunk := substring(p_content, chunk_start, chunk_end - chunk_start + 1);
        
        -- Skip very small chunks
        IF length(current_chunk) > 50 THEN
            -- Calculate word and character counts
            word_count := array_length(string_to_array(current_chunk, ' '), 1);
            char_count := length(current_chunk);
            
            -- Insert chunk
            INSERT INTO document_chunks (
                document_id, 
                chunk_index, 
                content, 
                word_count, 
                char_count,
                metadata
            ) VALUES (
                p_document_id, 
                chunk_count, 
                current_chunk, 
                word_count, 
                char_count,
                jsonb_build_object(
                    'start_position', chunk_start,
                    'end_position', chunk_end,
                    'chunk_size', length(current_chunk)
                )
            );
            
            chunk_count := chunk_count + 1;
        END IF;
        
        -- Move to next chunk with overlap
        chunk_start := chunk_end - p_overlap + 1;
        
        -- Prevent infinite loop
        IF chunk_start <= chunk_end - p_chunk_size + p_overlap THEN
            chunk_start := chunk_end + 1;
        END IF;
    END LOOP;
    
    RETURN chunk_count;
END;
$$ LANGUAGE plpgsql;

-- Function to find similar documents using vector search
CREATE OR REPLACE FUNCTION find_similar_documents(
    p_query_embedding vector(1536),
    p_gpt_id UUID DEFAULT NULL,
    p_team_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 10,
    p_similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    chunk_id UUID,
    document_id UUID,
    document_name TEXT,
    chunk_content TEXT,
    similarity FLOAT,
    chunk_index INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dc.id as chunk_id,
        d.id as document_id,
        d.name as document_name,
        dc.content as chunk_content,
        (1 - (de.embedding <=> p_query_embedding)) as similarity,
        dc.chunk_index
    FROM document_embeddings de
    JOIN document_chunks dc ON de.chunk_id = dc.id
    JOIN documents d ON dc.document_id = d.id
    LEFT JOIN gpt_context_documents gcd ON d.id = gcd.document_id AND gcd.gpt_id = p_gpt_id
    WHERE 
        (p_gpt_id IS NULL OR gcd.is_active = true)
        AND (p_team_id IS NULL OR d.team_id = p_team_id)
        AND (1 - (de.embedding <=> p_query_embedding)) >= p_similarity_threshold
    ORDER BY de.embedding <=> p_query_embedding
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get relevant context for a chat session
CREATE OR REPLACE FUNCTION get_chat_context(
    p_session_id UUID,
    p_query_embedding vector(1536),
    p_max_tokens INTEGER DEFAULT 4000
)
RETURNS TABLE (
    content TEXT,
    source_type TEXT,
    relevance_score FLOAT
) AS $$
DECLARE
    current_tokens INTEGER := 0;
    gpt_id_val UUID;
    team_id_val UUID;
BEGIN
    -- Get GPT and team information for the session
    SELECT cs.gpt_id, cs.team_id INTO gpt_id_val, team_id_val
    FROM chat_sessions cs WHERE cs.id = p_session_id;
    
    -- Return context from multiple sources, ordered by relevance
    RETURN QUERY
    WITH context_sources AS (
        (
            -- Recent chat messages from the session
            SELECT 
                cm.content,
                'chat_history' as source_type,
                0.9 as base_relevance,
                length(cm.content) as token_estimate
            FROM chat_messages cm
            WHERE cm.session_id = p_session_id
            ORDER BY cm.created_at DESC
            LIMIT 10
        )
        
        UNION ALL
        
        (
            -- Similar document chunks
            SELECT 
                sd.chunk_content as content,
                'document' as source_type,
                sd.similarity as base_relevance,
                length(sd.chunk_content) as token_estimate
            FROM find_similar_documents(p_query_embedding, gpt_id_val, team_id_val, 5, 0.7) sd
        )
        
        UNION ALL
        
        (
            -- Relevant memory items
            SELECT 
                mem.content,
                'memory' as source_type,
                (1 - (mem.embedding <=> p_query_embedding)) as base_relevance,
                length(mem.content) as token_estimate
            FROM enhanced_memory_items mem
            WHERE 
                mem.session_id = p_session_id
                AND (1 - (mem.embedding <=> p_query_embedding)) >= 0.6
            ORDER BY mem.importance_score DESC, mem.access_count DESC
            LIMIT 5
        )
    )
    SELECT 
        cs.content,
        cs.source_type,
        cs.base_relevance as relevance_score
    FROM context_sources cs
    ORDER BY cs.base_relevance DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to update memory importance based on access patterns
CREATE OR REPLACE FUNCTION update_memory_importance(p_memory_id UUID)
RETURNS VOID AS $$
DECLARE
    current_importance FLOAT;
    access_frequency FLOAT;
    recency_factor FLOAT;
    new_importance FLOAT;
BEGIN
    -- Get current values
    SELECT 
        importance_score,
        access_count,
        EXTRACT(EPOCH FROM (NOW() - last_accessed_at)) / 86400.0 as days_since_access
    INTO current_importance, access_frequency, recency_factor
    FROM enhanced_memory_items
    WHERE id = p_memory_id;
    
    -- Calculate new importance score
    -- Factors: access frequency (positive), recency (negative decay), current importance
    new_importance := LEAST(1.0, GREATEST(0.1,
        current_importance * 0.7 + 
        (access_frequency / 100.0) * 0.2 + 
        (1.0 / (1.0 + recency_factor)) * 0.1
    ));
    
    -- Update the memory item
    UPDATE enhanced_memory_items 
    SET 
        importance_score = new_importance,
        access_count = access_count + 1,
        last_accessed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_memory_id;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old context windows and maintain optimal size
CREATE OR REPLACE FUNCTION cleanup_context_windows(p_session_id UUID)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Keep only the most recent 50 context windows per session
    WITH old_contexts AS (
        SELECT id
        FROM chat_context_windows
        WHERE session_id = p_session_id
        ORDER BY created_at DESC
        OFFSET 50
    )
    DELETE FROM chat_context_windows
    WHERE id IN (SELECT id FROM old_contexts);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to cache internet search results
CREATE OR REPLACE FUNCTION cache_search_results(
    p_query TEXT,
    p_provider search_provider,
    p_results JSONB
)
RETURNS UUID AS $$
DECLARE
    query_hash_val TEXT;
    cache_id UUID;
BEGIN
    -- Generate hash for the query
    query_hash_val := encode(digest(lower(trim(p_query)) || p_provider::text, 'sha256'), 'hex');
    
    -- Insert or update cache entry
    INSERT INTO internet_search_cache (query_hash, query, provider, results)
    VALUES (query_hash_val, p_query, p_provider, p_results)
    ON CONFLICT (query_hash) 
    DO UPDATE SET 
        results = p_results,
        created_at = NOW(),
        expires_at = NOW() + INTERVAL '24 hours'
    RETURNING id INTO cache_id;
    
    RETURN cache_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get cached search results
CREATE OR REPLACE FUNCTION get_cached_search_results(
    p_query TEXT,
    p_provider search_provider
)
RETURNS JSONB AS $$
DECLARE
    query_hash_val TEXT;
    cached_results JSONB;
BEGIN
    -- Generate hash for the query
    query_hash_val := encode(digest(lower(trim(p_query)) || p_provider::text, 'sha256'), 'hex');
    
    -- Get cached results if not expired
    SELECT results INTO cached_results
    FROM internet_search_cache
    WHERE query_hash = query_hash_val AND expires_at > NOW();
    
    RETURN cached_results;
END;
$$ LANGUAGE plpgsql;

-- Function to add document to GPT context
CREATE OR REPLACE FUNCTION add_document_to_gpt_context(
    p_gpt_id UUID,
    p_document_id UUID,
    p_user_id UUID,
    p_priority INTEGER DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
    context_id UUID;
BEGIN
    INSERT INTO gpt_context_documents (gpt_id, document_id, added_by, priority)
    VALUES (p_gpt_id, p_document_id, p_user_id, p_priority)
    ON CONFLICT (gpt_id, document_id) 
    DO UPDATE SET 
        is_active = true,
        priority = p_priority,
        added_at = NOW()
    RETURNING id INTO context_id;
    
    RETURN context_id;
END;
$$ LANGUAGE plpgsql;

-- Function to remove document from GPT context
CREATE OR REPLACE FUNCTION remove_document_from_gpt_context(
    p_gpt_id UUID,
    p_document_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE gpt_context_documents 
    SET is_active = false
    WHERE gpt_id = p_gpt_id AND document_id = p_document_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate token count for text
CREATE OR REPLACE FUNCTION calculate_token_count(p_text TEXT)
RETURNS INTEGER AS $$
BEGIN
    -- Rough estimation: 1 token ≈ 4 characters for English text
    -- This is a simplified calculation, for accuracy use tiktoken in application
    RETURN CEILING(length(p_text) / 4.0);
END;
$$ LANGUAGE plpgsql;

-- Function to create a new context window
CREATE OR REPLACE FUNCTION create_context_window(
    p_session_id UUID,
    p_context_data JSONB,
    p_embedding vector(1536)
)
RETURNS UUID AS $$
DECLARE
    context_id UUID;
    token_count INTEGER;
BEGIN
    -- Calculate token count for the context
    token_count := calculate_token_count(p_context_data::text);
    
    -- Insert new context window
    INSERT INTO chat_context_windows (session_id, context_data, embedding, token_count)
    VALUES (p_session_id, p_context_data, p_embedding, token_count)
    RETURNING id INTO context_id;
    
    -- Clean up old context windows
    PERFORM cleanup_context_windows(p_session_id);
    
    RETURN context_id;
END;
$$ LANGUAGE plpgsql;

-- Function to search across all content types
CREATE OR REPLACE FUNCTION search_all_content(
    p_query TEXT,
    p_user_id UUID,
    p_team_id UUID,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    content_id UUID,
    content_type TEXT,
    title TEXT,
    content_snippet TEXT,
    relevance_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    WITH search_results AS (
        -- Search documents
        SELECT 
            d.id as content_id,
            'document' as content_type,
            d.name as title,
            COALESCE(substring(dc.content, 1, 200), d.name) as content_snippet,
            ts_rank(to_tsvector('english', d.name || ' ' || COALESCE(dc.content, '')), plainto_tsquery('english', p_query)) as relevance_score,
            d.uploaded_at as created_at
        FROM documents d
        LEFT JOIN document_chunks dc ON d.id = dc.document_id
        WHERE 
            d.team_id = p_team_id
            AND (
                to_tsvector('english', d.name) @@ plainto_tsquery('english', p_query)
                OR to_tsvector('english', COALESCE(dc.content, '')) @@ plainto_tsquery('english', p_query)
            )
        
        UNION ALL
        
        -- Search memory items
        SELECT 
            mem.id as content_id,
            'memory' as content_type,
            'Memory Item' as title,
            substring(mem.content, 1, 200) as content_snippet,
            ts_rank(to_tsvector('english', mem.content), plainto_tsquery('english', p_query)) as relevance_score,
            mem.created_at
        FROM enhanced_memory_items mem
        WHERE 
            mem.team_id = p_team_id
            AND to_tsvector('english', mem.content) @@ plainto_tsquery('english', p_query)
        
        UNION ALL
        
        -- Search GPTs
        SELECT 
            g.id as content_id,
            'gpt' as content_type,
            g.name as title,
            COALESCE(substring(g.description, 1, 200), g.name) as content_snippet,
            ts_rank(to_tsvector('english', g.name || ' ' || COALESCE(g.description, '')), plainto_tsquery('english', p_query)) as relevance_score,
            g.created_at
        FROM gpts g
        WHERE 
            g.team_id = p_team_id
            AND to_tsvector('english', g.name || ' ' || COALESCE(g.description, '')) @@ plainto_tsquery('english', p_query)
    )
    SELECT * FROM search_results
    WHERE relevance_score > 0
    ORDER BY relevance_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON FUNCTION chunk_document(UUID, TEXT, INTEGER, INTEGER) IS 'Chunks document content for vector processing';
COMMENT ON FUNCTION find_similar_documents(vector, UUID, UUID, INTEGER, FLOAT) IS 'Finds similar document chunks using vector similarity';
COMMENT ON FUNCTION get_chat_context(UUID, vector, INTEGER) IS 'Retrieves relevant context for chat sessions';
COMMENT ON FUNCTION update_memory_importance(UUID) IS 'Updates memory importance based on access patterns';
COMMENT ON FUNCTION cleanup_context_windows(UUID) IS 'Maintains optimal context window size per session';
COMMENT ON FUNCTION cache_search_results(TEXT, search_provider, JSONB) IS 'Caches internet search results';
COMMENT ON FUNCTION get_cached_search_results(TEXT, search_provider) IS 'Retrieves cached search results';
COMMENT ON FUNCTION search_all_content(TEXT, UUID, UUID, INTEGER) IS 'Full-text search across all content types';