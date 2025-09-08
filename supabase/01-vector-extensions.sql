-- Phase 1: Enable Vector Extensions and Create Vector Tables
-- This file sets up the foundation for vector-based document chunking and search

-- Enable the vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable additional extensions for text processing
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- Create enum types for vector-related operations
CREATE TYPE chunk_type AS ENUM ('text', 'table', 'image', 'code', 'header');
CREATE TYPE embedding_model AS ENUM ('text-embedding-ada-002', 'text-embedding-3-small', 'text-embedding-3-large');
CREATE TYPE search_provider AS ENUM ('google', 'bing', 'duckduckgo');

-- Document chunks table for storing processed document pieces
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_type chunk_type DEFAULT 'text',
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    word_count INTEGER DEFAULT 0,
    char_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique chunk ordering per document
    CONSTRAINT unique_document_chunk_index UNIQUE (document_id, chunk_index),
    CONSTRAINT chunk_content_not_empty CHECK (length(content) > 0),
    CONSTRAINT chunk_index_positive CHECK (chunk_index >= 0)
);

-- Vector embeddings table for storing document chunk embeddings
CREATE TABLE document_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chunk_id UUID NOT NULL REFERENCES document_chunks(id) ON DELETE CASCADE,
    embedding vector(1536), -- OpenAI ada-002 dimension, adjust for other models
    model embedding_model DEFAULT 'text-embedding-ada-002',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one embedding per chunk per model
    CONSTRAINT unique_chunk_model_embedding UNIQUE (chunk_id, model)
);

-- GPT context documents table - links documents to GPTs for context
CREATE TABLE gpt_context_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gpt_id UUID NOT NULL REFERENCES gpts(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    added_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0, -- Higher priority documents are searched first
    
    -- Ensure unique document per GPT
    CONSTRAINT unique_gpt_document UNIQUE (gpt_id, document_id)
);

-- Internet search cache table
CREATE TABLE internet_search_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_hash TEXT NOT NULL UNIQUE, -- Hash of the search query for deduplication
    query TEXT NOT NULL,
    provider search_provider NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    
    CONSTRAINT search_query_not_empty CHECK (length(query) > 0)
);

-- Chat context windows table - manages AI context for conversations
CREATE TABLE chat_context_windows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    context_data JSONB NOT NULL, -- Stores the actual context messages
    embedding vector(1536), -- Embedding of the context for similarity search
    token_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT context_data_not_empty CHECK (jsonb_array_length(context_data) > 0),
    CONSTRAINT token_count_positive CHECK (token_count >= 0)
);

-- PDF generation jobs table
CREATE TABLE pdf_generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT pdf_prompt_not_empty CHECK (length(prompt) > 0),
    CONSTRAINT pdf_status_valid CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Enhanced memory items with vector search capabilities
CREATE TABLE enhanced_memory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536),
    importance_score FLOAT DEFAULT 0.5, -- 0-1 scale for memory importance
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tags TEXT[] DEFAULT '{}',
    
    CONSTRAINT memory_content_not_empty CHECK (length(content) > 0),
    CONSTRAINT importance_score_range CHECK (importance_score >= 0 AND importance_score <= 1)
);

-- Create indexes for optimal performance
-- Document chunks indexes
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_chunk_index ON document_chunks(chunk_index);
CREATE INDEX idx_document_chunks_type ON document_chunks(chunk_type);
CREATE INDEX idx_document_chunks_word_count ON document_chunks(word_count);

-- Vector similarity search indexes (HNSW for fast approximate search)
CREATE INDEX idx_document_embeddings_vector ON document_embeddings USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_document_embeddings_chunk_id ON document_embeddings(chunk_id);
CREATE INDEX idx_document_embeddings_model ON document_embeddings(model);

-- GPT context documents indexes
CREATE INDEX idx_gpt_context_gpt_id ON gpt_context_documents(gpt_id);
CREATE INDEX idx_gpt_context_document_id ON gpt_context_documents(document_id);
CREATE INDEX idx_gpt_context_priority ON gpt_context_documents(priority DESC);
CREATE INDEX idx_gpt_context_active ON gpt_context_documents(is_active) WHERE is_active = true;

-- Internet search cache indexes
CREATE INDEX idx_search_cache_query_hash ON internet_search_cache(query_hash);
CREATE INDEX idx_search_cache_expires_at ON internet_search_cache(expires_at);
CREATE INDEX idx_search_cache_provider ON internet_search_cache(provider);

-- Chat context windows indexes
CREATE INDEX idx_context_windows_session_id ON chat_context_windows(session_id);
CREATE INDEX idx_context_windows_embedding ON chat_context_windows USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_context_windows_token_count ON chat_context_windows(token_count);

-- PDF generation jobs indexes
CREATE INDEX idx_pdf_jobs_user_id ON pdf_generation_jobs(user_id);
CREATE INDEX idx_pdf_jobs_status ON pdf_generation_jobs(status);
CREATE INDEX idx_pdf_jobs_created_at ON pdf_generation_jobs(created_at);

-- Enhanced memory items indexes
CREATE INDEX idx_enhanced_memory_session_id ON enhanced_memory_items(session_id);
CREATE INDEX idx_enhanced_memory_user_id ON enhanced_memory_items(user_id);
CREATE INDEX idx_enhanced_memory_embedding ON enhanced_memory_items USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_enhanced_memory_importance ON enhanced_memory_items(importance_score DESC);
CREATE INDEX idx_enhanced_memory_access_count ON enhanced_memory_items(access_count DESC);
CREATE INDEX idx_enhanced_memory_tags ON enhanced_memory_items USING gin(tags);

-- Full-text search indexes
CREATE INDEX idx_document_chunks_search ON document_chunks USING gin(to_tsvector('english', content));
CREATE INDEX idx_enhanced_memory_search ON enhanced_memory_items USING gin(to_tsvector('english', content));

-- Cleanup expired search cache automatically
-- Removed invalid partial index (used NOW() in predicate which is not IMMUTABLE)

-- Comments for documentation
COMMENT ON TABLE document_chunks IS 'Stores processed document chunks for vector search';
COMMENT ON TABLE document_embeddings IS 'Vector embeddings for document chunks using various models';
COMMENT ON TABLE gpt_context_documents IS 'Links documents to GPTs for context-aware conversations';
COMMENT ON TABLE internet_search_cache IS 'Caches internet search results to reduce API calls';
COMMENT ON TABLE chat_context_windows IS 'Manages AI context windows for better conversation flow';
COMMENT ON TABLE pdf_generation_jobs IS 'Tracks PDF generation requests and status';
COMMENT ON TABLE enhanced_memory_items IS 'Enhanced memory system with vector search capabilities';

COMMENT ON COLUMN document_embeddings.embedding IS 'Vector embedding using OpenAI or other embedding models';
COMMENT ON COLUMN chat_context_windows.embedding IS 'Embedding of context for similarity-based retrieval';
COMMENT ON COLUMN enhanced_memory_items.importance_score IS 'Importance score for memory prioritization (0-1)';