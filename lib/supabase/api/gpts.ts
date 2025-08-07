import { createSupabaseClient, handleSupabaseError } from '../client'
import type { Database } from '../database.types'

type GPT = Database['public']['Tables']['gpts']['Row']
type GPTInsert = Database['public']['Tables']['gpts']['Insert']
type GPTUpdate = Database['public']['Tables']['gpts']['Update']

export class GPTsAPI {
  private supabase = createSupabaseClient()

  // Get all GPTs accessible to the current user
  async getGPTs(filters?: {
    teamId?: string
    status?: string
    category?: string
    search?: string
    limit?: number
    offset?: number
  }) {
    try {
      let query = this.supabase
        .from('gpts')
        .select(`
          *,
          creator:users!creator_id(id, full_name, email),
          team:teams!team_id(id, name)
        `)

      // Apply filters
      if (filters?.teamId) {
        query = query.eq('team_id', filters.teamId)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1)
      }

      // Order by created_at desc
      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get a single GPT by ID
  async getGPT(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('gpts')
        .select(`
          *,
          creator:users!creator_id(id, full_name, email),
          team:teams!team_id(id, name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Create a new GPT
  async createGPT(gpt: GPTInsert) {
    try {
      const { data, error } = await this.supabase
        .from('gpts')
        .insert(gpt)
        .select(`
          *,
          creator:users!creator_id(id, full_name, email),
          team:teams!team_id(id, name)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('create', 'gpt', data.id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Update a GPT
  async updateGPT(id: string, updates: GPTUpdate) {
    try {
      const { data, error } = await this.supabase
        .from('gpts')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          creator:users!creator_id(id, full_name, email),
          team:teams!team_id(id, name)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('update', 'gpt', id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Delete a GPT
  async deleteGPT(id: string) {
    try {
      const { error } = await this.supabase
        .from('gpts')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Log the action
      await this.logAction('delete', 'gpt', id)

      return { error: null }
    } catch (error) {
      return { error: handleSupabaseError(error) }
    }
  }

  // Get GPT usage statistics
  async getGPTStats(gptId: string, dateRange?: { from: string; to: string }) {
    try {
      let query = this.supabase
        .from('usage_analytics')
        .select('*')
        .eq('gpt_id', gptId)

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)
      }

      const { data, error } = await query

      if (error) throw error

      // Calculate aggregated stats
      const stats = {
        totalUsage: data.length,
        totalTokens: data.reduce((sum, record) => sum + (record.tokens_used || 0), 0),
        totalCost: data.reduce((sum, record) => sum + (record.cost || 0), 0),
        avgResponseTime: data.length > 0 
          ? data.reduce((sum, record) => sum + (record.response_time_ms || 0), 0) / data.length 
          : 0,
        usageByDate: data.reduce((acc: Record<string, number>, record) => {
          const date = record.date || new Date(record.created_at).toISOString().split('T')[0]
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})
      }

      return { data: stats, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get popular GPTs
  async getPopularGPTs(limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from('gpts')
        .select(`
          *,
          creator:users!creator_id(id, full_name, email),
          team:teams!team_id(id, name)
        `)
        .eq('status', 'active')
        .order('usage_count', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Rate a GPT
  async rateGPT(gptId: string, rating: number) {
    try {
      // First get current rating data
      const { data: currentGPT, error: fetchError } = await this.supabase
        .from('gpts')
        .select('rating, usage_count')
        .eq('id', gptId)
        .single()

      if (fetchError) throw fetchError

      // Calculate new rating (simple average for now)
      const currentRating = currentGPT.rating || 0
      const usageCount = currentGPT.usage_count || 0
      const newRating = usageCount > 0 
        ? ((currentRating * usageCount) + rating) / (usageCount + 1)
        : rating

      const { data, error } = await this.supabase
        .from('gpts')
        .update({ rating: newRating })
        .eq('id', gptId)
        .select()
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('rate', 'gpt', gptId, { rating })

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
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
export const gptsAPI = new GPTsAPI()