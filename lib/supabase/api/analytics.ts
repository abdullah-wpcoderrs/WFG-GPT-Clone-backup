import { createSupabaseClient, handleSupabaseError } from '../client'
import type { Database } from '../database.types'

type UsageAnalytics = Database['public']['Tables']['usage_analytics']['Row']
type AuditLog = Database['public']['Tables']['audit_logs']['Row']

export class AnalyticsAPI {
  private supabase = createSupabaseClient()

  // =============================================
  // USAGE ANALYTICS
  // =============================================

  // Get usage analytics with filters
  async getUsageAnalytics(filters?: {
    userId?: string
    gptId?: string
    teamId?: string
    dateRange?: { from: string; to: string }
    limit?: number
    offset?: number
  }) {
    try {
      let query = this.supabase
        .from('usage_analytics')
        .select(`
          *,
          user:users!user_id(id, full_name, email),
          gpt:gpts!gpt_id(id, name, category),
          team:teams!team_id(id, name)
        `)

      // Apply filters
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters?.gptId) {
        query = query.eq('gpt_id', filters.gptId)
      }
      if (filters?.teamId) {
        query = query.eq('team_id', filters.teamId)
      }
      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.from)
          .lte('created_at', filters.dateRange.to)
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 100)) - 1)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get aggregated usage statistics
  async getUsageStats(filters?: {
    userId?: string
    teamId?: string
    dateRange?: { from: string; to: string }
    groupBy?: 'day' | 'week' | 'month'
  }) {
    try {
      let query = this.supabase
        .from('usage_analytics')
        .select('*')

      // Apply filters
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters?.teamId) {
        query = query.eq('team_id', filters.teamId)
      }
      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.from)
          .lte('created_at', filters.dateRange.to)
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
        
        // Group by date
        usageByDate: this.groupByDate(data, filters?.groupBy || 'day'),
        
        // Group by GPT
        usageByGPT: data.reduce((acc: Record<string, any>, record) => {
          const gptId = record.gpt_id || 'unknown'
          if (!acc[gptId]) {
            acc[gptId] = {
              usage: 0,
              tokens: 0,
              cost: 0,
              avgResponseTime: 0
            }
          }
          acc[gptId].usage += 1
          acc[gptId].tokens += record.tokens_used || 0
          acc[gptId].cost += record.cost || 0
          acc[gptId].avgResponseTime += record.response_time_ms || 0
          return acc
        }, {}),

        // Group by user
        usageByUser: data.reduce((acc: Record<string, any>, record) => {
          const userId = record.user_id || 'unknown'
          if (!acc[userId]) {
            acc[userId] = {
              usage: 0,
              tokens: 0,
              cost: 0
            }
          }
          acc[userId].usage += 1
          acc[userId].tokens += record.tokens_used || 0
          acc[userId].cost += record.cost || 0
          return acc
        }, {})
      }

      // Calculate average response times
      Object.keys(stats.usageByGPT).forEach(gptId => {
        const gptStats = stats.usageByGPT[gptId]
        gptStats.avgResponseTime = gptStats.usage > 0 ? gptStats.avgResponseTime / gptStats.usage : 0
      })

      return { data: stats, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get cost analysis
  async getCostAnalysis(filters?: {
    teamId?: string
    dateRange?: { from: string; to: string }
  }) {
    try {
      let query = this.supabase
        .from('usage_analytics')
        .select(`
          cost,
          tokens_used,
          created_at,
          gpt:gpts!gpt_id(id, name, model),
          user:users!user_id(id, full_name)
        `)

      if (filters?.teamId) {
        query = query.eq('team_id', filters.teamId)
      }
      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.from)
          .lte('created_at', filters.dateRange.to)
      }

      const { data, error } = await query

      if (error) throw error

      const analysis = {
        totalCost: data.reduce((sum, record) => sum + (record.cost || 0), 0),
        totalTokens: data.reduce((sum, record) => sum + (record.tokens_used || 0), 0),
        avgCostPerToken: 0,
        costByModel: {} as Record<string, number>,
        costByUser: {} as Record<string, number>,
        costByDate: this.groupByDate(data.map(d => ({ ...d, value: d.cost || 0 })), 'day'),
        topSpenders: {} as Record<string, { name: string; cost: number; tokens: number }>
      }

      // Calculate average cost per token
      analysis.avgCostPerToken = analysis.totalTokens > 0 
        ? analysis.totalCost / analysis.totalTokens 
        : 0

      // Group costs by model
      data.forEach(record => {
        const model = record.gpt?.model || 'unknown'
        analysis.costByModel[model] = (analysis.costByModel[model] || 0) + (record.cost || 0)
      })

      // Group costs by user and find top spenders
      data.forEach(record => {
        const userId = record.user?.id || 'unknown'
        const userName = record.user?.full_name || 'Unknown User'
        
        if (!analysis.topSpenders[userId]) {
          analysis.topSpenders[userId] = { name: userName, cost: 0, tokens: 0 }
        }
        analysis.topSpenders[userId].cost += record.cost || 0
        analysis.topSpenders[userId].tokens += record.tokens_used || 0
      })

      return { data: analysis, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // =============================================
  // AUDIT LOGS
  // =============================================

  // Get audit logs with filters
  async getAuditLogs(filters?: {
    userId?: string
    action?: string
    resourceType?: string
    dateRange?: { from: string; to: string }
    limit?: number
    offset?: number
  }) {
    try {
      let query = this.supabase
        .from('audit_logs')
        .select(`
          *,
          user:users!user_id(id, full_name, email)
        `)

      // Apply filters
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters?.action) {
        query = query.eq('action', filters.action)
      }
      if (filters?.resourceType) {
        query = query.eq('resource_type', filters.resourceType)
      }
      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.from)
          .lte('created_at', filters.dateRange.to)
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get audit statistics
  async getAuditStats(filters?: {
    teamId?: string
    dateRange?: { from: string; to: string }
  }) {
    try {
      let query = this.supabase
        .from('audit_logs')
        .select('action, resource_type, created_at, user_id')

      // For team filtering, we need to join with users
      if (filters?.teamId) {
        query = query.in('user_id', 
          this.supabase
            .from('users')
            .select('id')
            .eq('team_id', filters.teamId)
        )
      }

      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.from)
          .lte('created_at', filters.dateRange.to)
      }

      const { data, error } = await query

      if (error) throw error

      const stats = {
        totalActions: data.length,
        actionsByType: data.reduce((acc: Record<string, number>, log) => {
          acc[log.action] = (acc[log.action] || 0) + 1
          return acc
        }, {}),
        actionsByResource: data.reduce((acc: Record<string, number>, log) => {
          acc[log.resource_type] = (acc[log.resource_type] || 0) + 1
          return acc
        }, {}),
        actionsByDate: this.groupByDate(data, 'day'),
        actionsByUser: data.reduce((acc: Record<string, number>, log) => {
          const userId = log.user_id || 'system'
          acc[userId] = (acc[userId] || 0) + 1
          return acc
        }, {})
      }

      return { data: stats, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // =============================================
  // DASHBOARD METRICS
  // =============================================

  // Get comprehensive dashboard metrics
  async getDashboardMetrics(teamId?: string, dateRange?: { from: string; to: string }) {
    try {
      // Get all metrics in parallel
      const [
        usageStats,
        costAnalysis,
        auditStats,
        activeUsers,
        topGPTs
      ] = await Promise.all([
        this.getUsageStats({ teamId, dateRange }),
        this.getCostAnalysis({ teamId, dateRange }),
        this.getAuditStats({ teamId, dateRange }),
        this.getActiveUsers(teamId, dateRange),
        this.getTopGPTs(teamId, dateRange)
      ])

      return {
        data: {
          usage: usageStats.data,
          costs: costAnalysis.data,
          audit: auditStats.data,
          activeUsers: activeUsers.data,
          topGPTs: topGPTs.data
        },
        error: null
      }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get active users count
  private async getActiveUsers(teamId?: string, dateRange?: { from: string; to: string }) {
    try {
      let query = this.supabase
        .from('usage_analytics')
        .select('user_id')

      if (teamId) {
        query = query.eq('team_id', teamId)
      }
      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)
      }

      const { data, error } = await query

      if (error) throw error

      const uniqueUsers = new Set(data.map(record => record.user_id).filter(Boolean))
      return { data: uniqueUsers.size, error: null }
    } catch (error) {
      return { data: 0, error: handleSupabaseError(error) }
    }
  }

  // Get top GPTs by usage
  private async getTopGPTs(teamId?: string, dateRange?: { from: string; to: string }, limit = 5) {
    try {
      let query = this.supabase
        .from('usage_analytics')
        .select(`
          gpt_id,
          gpt:gpts!gpt_id(id, name, category)
        `)

      if (teamId) {
        query = query.eq('team_id', teamId)
      }
      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)
      }

      const { data, error } = await query

      if (error) throw error

      // Count usage by GPT
      const gptUsage = data.reduce((acc: Record<string, any>, record) => {
        const gptId = record.gpt_id
        if (!gptId || !record.gpt) return acc
        
        if (!acc[gptId]) {
          acc[gptId] = {
            id: gptId,
            name: record.gpt.name,
            category: record.gpt.category,
            usage: 0
          }
        }
        acc[gptId].usage += 1
        return acc
      }, {})

      // Sort by usage and take top N
      const topGPTs = Object.values(gptUsage)
        .sort((a: any, b: any) => b.usage - a.usage)
        .slice(0, limit)

      return { data: topGPTs, error: null }
    } catch (error) {
      return { data: [], error: handleSupabaseError(error) }
    }
  }

  // Helper method to group data by date
  private groupByDate(data: any[], groupBy: 'day' | 'week' | 'month' = 'day') {
    return data.reduce((acc: Record<string, any>, record) => {
      let dateKey: string
      const date = new Date(record.created_at)
      
      switch (groupBy) {
        case 'week':
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          dateKey = weekStart.toISOString().split('T')[0]
          break
        case 'month':
          dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          break
        default: // day
          dateKey = date.toISOString().split('T')[0]
      }

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          count: 0,
          value: 0
        }
      }
      
      acc[dateKey].count += 1
      acc[dateKey].value += record.value || record.cost || record.tokens_used || 1
      
      return acc
    }, {})
  }
}

// Export singleton instance
export const analyticsAPI = new AnalyticsAPI()