// Vector API Service for Document Processing and Search
// This service handles all vector-related operations including chunking, embeddings, and search

import { createSupabaseClient, createSupabaseAdminClient } from '@/lib/supabase/client'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export class VectorAPI {
  private supabase = createSupabaseAdminClient()
  private clientSupabase = createSupabaseClient()

  // Process and chunk a document
  async processDocument(documentId: string, content: string, options?: {
    chunkSize?: number
    overlap?: number
    generateEmbeddings?: boolean
  }) {
    try {
      const { chunkSize = 1000, overlap = 200, generateEmbeddings = true } = options || {}

      // Chunk the document using the database function
      const { data: chunkCount, error: chunkError } = await this.supabase
        .rpc('chunk_document', {
          p_document_id: documentId,
          p_content: content,
          p_chunk_size: chunkSize,
          p_overlap: overlap
        })

      if (chunkError) throw chunkError

      // Get the created chunks
      const { data: chunks, error: chunksError } = await this.supabase
        .from('document_chunks')
        .select('*')
        .eq('document_id', documentId)
        .order('chunk_index')

      if (chunksError) throw chunksError

      // Generate embeddings if requested
      if (generateEmbeddings && chunks) {
        await this.generateEmbeddingsForChunks(chunks)
      }

      return {
        success: true,
        chunkCount: chunkCount,
        chunks: chunks
      }
    } catch (error) {
      console.error('Error processing document:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Generate embeddings for document chunks
  async generateEmbeddingsForChunks(chunks: any[]) {
    try {
      const embeddings = []

      for (const chunk of chunks) {
        try {
          // Generate embedding using OpenAI
          const response = await openai.embeddings.create({
            model: 'text-embedding-3-small', // More cost-effective than ada-002
            input: chunk.content,
            encoding_format: 'float'
          })

          const embedding = response.data[0].embedding

          // Store embedding in database
          const { error } = await this.supabase
            .from('document_embeddings')
            .insert({
              chunk_id: chunk.id,
              embedding: embedding,
              model: 'text-embedding-3-small'
            })

          if (error) {
            console.error('Error storing embedding for chunk:', chunk.id, error)
          } else {
            embeddings.push({ chunkId: chunk.id, success: true })
          }
        } catch (error) {
          console.error('Error generating embedding for chunk:', chunk.id, error)
          embeddings.push({ chunkId: chunk.id, success: false, error })
        }
      }

      return embeddings
    } catch (error) {
      console.error('Error generating embeddings:', error)
      throw error
    }
  }

  // Search for similar documents using vector similarity
  async searchSimilarDocuments(query: string, options?: {
    gptId?: string
    teamId?: string
    limit?: number
    threshold?: number
  }) {
    try {
      const { gptId, teamId, limit = 10, threshold = 0.7 } = options || {}

      // Generate embedding for the query
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
        encoding_format: 'float'
      })

      const queryEmbedding = response.data[0].embedding

      // Search for similar documents
      const { data, error } = await this.supabase
        .rpc('find_similar_documents', {
          p_query_embedding: queryEmbedding,
          p_gpt_id: gptId || null,
          p_team_id: teamId || null,
          p_limit: limit,
          p_similarity_threshold: threshold
        })

      if (error) throw error

      return {
        success: true,
        results: data || []
      }
    } catch (error) {
      console.error('Error searching similar documents:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        results: []
      }
    }
  }

  // Get relevant context for a chat session
  async getChatContext(sessionId: string, query: string, maxTokens: number = 4000) {
    try {
      // Generate embedding for the query
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
        encoding_format: 'float'
      })

      const queryEmbedding = response.data[0].embedding

      // Get context using the database function
      const { data, error } = await this.supabase
        .rpc('get_chat_context', {
          p_session_id: sessionId,
          p_query_embedding: queryEmbedding,
          p_max_tokens: maxTokens
        })

      if (error) throw error

      return {
        success: true,
        context: data || []
      }
    } catch (error) {
      console.error('Error getting chat context:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        context: []
      }
    }
  }

  // Add document to GPT context
  async addDocumentToGptContext(gptId: string, documentId: string, userId: string, priority: number = 0) {
    try {
      const { data, error } = await this.supabase
        .rpc('add_document_to_gpt_context', {
          p_gpt_id: gptId,
          p_document_id: documentId,
          p_user_id: userId,
          p_priority: priority
        })

      if (error) throw error

      return {
        success: true,
        contextId: data
      }
    } catch (error) {
      console.error('Error adding document to GPT context:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Remove document from GPT context
  async removeDocumentFromGptContext(gptId: string, documentId: string) {
    try {
      const { data, error } = await this.supabase
        .rpc('remove_document_from_gpt_context', {
          p_gpt_id: gptId,
          p_document_id: documentId
        })

      if (error) throw error

      return {
        success: true,
        removed: data
      }
    } catch (error) {
      console.error('Error removing document from GPT context:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Create or update memory item with embedding
  async createMemoryItem(sessionId: string, userId: string, teamId: string, content: string, importanceScore: number = 0.5) {
    try {
      // Generate embedding for the memory content
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: content,
        encoding_format: 'float'
      })

      const embedding = response.data[0].embedding

      // Insert memory item
      const { data, error } = await this.supabase
        .from('enhanced_memory_items')
        .insert({
          session_id: sessionId,
          user_id: userId,
          team_id: teamId,
          content: content,
          embedding: embedding,
          importance_score: importanceScore
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        memory: data
      }
    } catch (error) {
      console.error('Error creating memory item:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Update memory importance based on access
  async updateMemoryImportance(memoryId: string) {
    try {
      const { error } = await this.supabase
        .rpc('update_memory_importance', {
          p_memory_id: memoryId
        })

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error updating memory importance:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Create context window for chat session
  async createContextWindow(sessionId: string, contextData: any) {
    try {
      // Generate embedding for the context
      const contextText = JSON.stringify(contextData)
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: contextText,
        encoding_format: 'float'
      })

      const embedding = response.data[0].embedding

      // Create context window
      const { data, error } = await this.supabase
        .rpc('create_context_window', {
          p_session_id: sessionId,
          p_context_data: contextData,
          p_embedding: embedding
        })

      if (error) throw error

      return {
        success: true,
        contextId: data
      }
    } catch (error) {
      console.error('Error creating context window:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Search across all content types
  async searchAllContent(query: string, userId: string, teamId: string, limit: number = 20) {
    try {
      const { data, error } = await this.supabase
        .rpc('search_all_content', {
          p_query: query,
          p_user_id: userId,
          p_team_id: teamId,
          p_limit: limit
        })

      if (error) throw error

      return {
        success: true,
        results: data || []
      }
    } catch (error) {
      console.error('Error searching all content:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        results: []
      }
    }
  }

  // Get GPT context documents
  async getGptContextDocuments(gptId: string) {
    try {
      const { data, error } = await this.supabase
        .from('gpt_context_documents')
        .select(`
          *,
          document:documents(
            id,
            name,
            type,
            size,
            uploaded_at
          )
        `)
        .eq('gpt_id', gptId)
        .eq('is_active', true)
        .order('priority', { ascending: false })

      if (error) throw error

      return {
        success: true,
        documents: data || []
      }
    } catch (error) {
      console.error('Error getting GPT context documents:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        documents: []
      }
    }
  }

  // Delete document and all related chunks/embeddings
  async deleteDocumentAndChunks(documentId: string) {
    try {
      // The foreign key constraints will handle cascading deletes
      // for chunks and embeddings when the document is deleted
      const { error } = await this.supabase
        .from('documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error deleting document and chunks:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get document chunks with embeddings
  async getDocumentChunks(documentId: string, withEmbeddings: boolean = false) {
    try {
      let query = this.supabase
        .from('document_chunks')
        .select(`
          *
          ${withEmbeddings ? ', document_embeddings(*)' : ''}
        `)
        .eq('document_id', documentId)
        .order('chunk_index')

      const { data, error } = await query

      if (error) throw error

      return {
        success: true,
        chunks: data || []
      }
    } catch (error) {
      console.error('Error getting document chunks:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        chunks: []
      }
    }
  }
}

export const vectorAPI = new VectorAPI()