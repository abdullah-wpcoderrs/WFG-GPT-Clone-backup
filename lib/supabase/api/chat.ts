import { createSupabaseClient, handleSupabaseError } from '../client'
import type { Database } from '../database.types'

type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
type ChatSessionInsert = Database['public']['Tables']['chat_sessions']['Insert']
type ChatSessionUpdate = Database['public']['Tables']['chat_sessions']['Update']
type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert']

export class ChatAPI {
  private supabase = createSupabaseClient()

  // =============================================
  // CHAT SESSIONS
  // =============================================

  // Get all chat sessions for the current user
  async getChatSessions(filters?: {
    status?: string
    gptId?: string
    search?: string
    limit?: number
    offset?: number
  }) {
    try {
      let query = this.supabase
        .from('chat_sessions')
        .select(`
          *,
          gpt:gpts!gpt_id(id, name, description, category),
          user:users!user_id(id, full_name, email)
        `)

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.gptId) {
        query = query.eq('gpt_id', filters.gptId)
      }
      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1)
      }

      // Order by updated_at desc
      query = query.order('updated_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get a single chat session with messages
  async getChatSession(id: string, includeMessages = true) {
    try {
      const { data: session, error: sessionError } = await this.supabase
        .from('chat_sessions')
        .select(`
          *,
          gpt:gpts!gpt_id(id, name, description, category, prompt, model, temperature, max_tokens),
          user:users!user_id(id, full_name, email)
        `)
        .eq('id', id)
        .single()

      if (sessionError) throw sessionError

      let messages = null
      if (includeMessages) {
        const { data: messagesData, error: messagesError } = await this.supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', id)
          .order('created_at', { ascending: true })

        if (messagesError) throw messagesError
        messages = messagesData
      }

      return { 
        data: { 
          ...session, 
          messages: messages || [] 
        }, 
        error: null 
      }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Create a new chat session
  async createChatSession(session: ChatSessionInsert) {
    try {
      const { data, error } = await this.supabase
        .from('chat_sessions')
        .insert(session)
        .select(`
          *,
          gpt:gpts!gpt_id(id, name, description, category),
          user:users!user_id(id, full_name, email)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('create', 'chat_session', data.id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Update a chat session
  async updateChatSession(id: string, updates: ChatSessionUpdate) {
    try {
      const { data, error } = await this.supabase
        .from('chat_sessions')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          gpt:gpts!gpt_id(id, name, description, category),
          user:users!user_id(id, full_name, email)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('update', 'chat_session', id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Delete a chat session
  async deleteChatSession(id: string) {
    try {
      const { error } = await this.supabase
        .from('chat_sessions')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Log the action
      await this.logAction('delete', 'chat_session', id)

      return { error: null }
    } catch (error) {
      return { error: handleSupabaseError(error) }
    }
  }

  // =============================================
  // CHAT MESSAGES
  // =============================================

  // Get messages for a chat session
  async getChatMessages(sessionId: string, limit?: number, offset?: number) {
    try {
      let query = this.supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (limit) {
        query = query.limit(limit)
      }
      if (offset) {
        query = query.range(offset, (offset + (limit || 50)) - 1)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Add a message to a chat session
  async addChatMessage(message: ChatMessageInsert) {
    try {
      const { data, error } = await this.supabase
        .from('chat_messages')
        .insert(message)
        .select()
        .single()

      if (error) throw error

      // Record usage analytics
      await this.recordUsageAnalytics(message.session_id, {
        tokens_used: message.tokens_used || 0,
        response_time_ms: message.response_time_ms || 0
      })

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Add multiple messages (for batch operations)
  async addChatMessages(messages: ChatMessageInsert[]) {
    try {
      const { data, error } = await this.supabase
        .from('chat_messages')
        .insert(messages)
        .select()

      if (error) throw error

      // Record usage analytics for each message
      for (const message of messages) {
        await this.recordUsageAnalytics(message.session_id, {
          tokens_used: message.tokens_used || 0,
          response_time_ms: message.response_time_ms || 0
        })
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // =============================================
  // ANALYTICS & UTILITIES
  // =============================================

  // Get chat statistics for a user
  async getChatStats(userId?: string, dateRange?: { from: string; to: string }) {
    try {
      let query = this.supabase
        .from('chat_sessions')
        .select('id, created_at, message_count, gpt_id')

      if (userId) {
        query = query.eq('user_id', userId)
      }

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)
      }

      const { data, error } = await query

      if (error) throw error

      // Calculate stats
      const stats = {
        totalSessions: data.length,
        totalMessages: data.reduce((sum, session) => sum + (session.message_count || 0), 0),
        avgMessagesPerSession: data.length > 0 
          ? data.reduce((sum, session) => sum + (session.message_count || 0), 0) / data.length 
          : 0,
        sessionsByDate: data.reduce((acc: Record<string, number>, session) => {
          const date = new Date(session.created_at).toISOString().split('T')[0]
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {}),
        gptUsage: data.reduce((acc: Record<string, number>, session) => {
          acc[session.gpt_id] = (acc[session.gpt_id] || 0) + 1
          return acc
        }, {})
      }

      return { data: stats, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Search chat messages
  async searchMessages(query: string, filters?: {
    sessionId?: string
    userId?: string
    dateRange?: { from: string; to: string }
    limit?: number
  }) {
    try {
      let searchQuery = this.supabase
        .from('chat_messages')
        .select(`
          *,
          session:chat_sessions!session_id(
            id, title, user_id,
            gpt:gpts!gpt_id(id, name)
          )
        `)
        .textSearch('content', query)

      // Apply filters
      if (filters?.sessionId) {
        searchQuery = searchQuery.eq('session_id', filters.sessionId)
      }

      if (filters?.userId) {
        searchQuery = searchQuery.eq('session.user_id', filters.userId)
      }

      if (filters?.dateRange) {
        searchQuery = searchQuery
          .gte('created_at', filters.dateRange.from)
          .lte('created_at', filters.dateRange.to)
      }

      if (filters?.limit) {
        searchQuery = searchQuery.limit(filters.limit)
      }

      searchQuery = searchQuery.order('created_at', { ascending: false })

      const { data, error } = await searchQuery

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Private method to record usage analytics
  private async recordUsageAnalytics(sessionId: string, metrics: {
    tokens_used: number
    response_time_ms: number
  }) {
    try {
      // Get session details
      const { data: session, error: sessionError } = await this.supabase
        .from('chat_sessions')
        .select('user_id, gpt_id, gpt:gpts!gpt_id(team_id)')
        .eq('id', sessionId)
        .single()

      if (sessionError) throw sessionError

      // Calculate cost (example: $0.002 per 1K tokens for GPT-4)
      const costPerToken = 0.000002
      const cost = metrics.tokens_used * costPerToken

      await this.supabase
        .from('usage_analytics')
        .insert({
          user_id: session.user_id,
          gpt_id: session.gpt_id,
          session_id: sessionId,
          team_id: session.gpt?.team_id,
          tokens_used: metrics.tokens_used,
          response_time_ms: metrics.response_time_ms,
          cost,
          metrics: {
            model: 'gpt-4',
            ...metrics
          }
        })
    } catch (error) {
      console.error('Failed to record usage analytics:', error)
    }
  }

  // Private method to log actions
  private async logAction(action: string, resourceType: string, resourceId: string, details?: any) {
    try {
      await this.supabase
        .from('audit_logs')
        .insert({
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {}
        })
    } catch (error) {
      console.error('Failed to log action:', error)
    }
  }
}

// Export singleton instance
export const chatAPI = new ChatAPI()