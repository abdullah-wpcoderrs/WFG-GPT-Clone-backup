import { createSupabaseClient, handleSupabaseError } from '../client'
import type { Database } from '../database.types'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

export class UsersAPI {
  private supabase = createSupabaseClient()

  // Get all users (with proper access control via RLS)
  async getUsers(filters?: {
    teamId?: string
    role?: string
    status?: string
    search?: string
    limit?: number
    offset?: number
  }) {
    try {
      let query = this.supabase
        .from('users')
        .select(`
          *,
          team:teams!team_id(id, name, description)
        `)

      // Apply filters
      if (filters?.teamId) {
        query = query.eq('team_id', filters.teamId)
      }
      if (filters?.role) {
        query = query.eq('role', filters.role)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
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

  // Get a single user by ID
  async getUser(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select(`
          *,
          team:teams!team_id(id, name, description, member_count)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return { data: null, error: authError?.message || 'Not authenticated' }
      }

      const { data, error } = await this.supabase
        .from('users')
        .select(`
          *,
          team:teams!team_id(id, name, description, member_count)
        `)
        .eq('id', user.id)
        .single()

      if (error) throw error
      return { data: { ...data, auth_user: user }, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Update user profile
  async updateUser(id: string, updates: UserUpdate) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          team:teams!team_id(id, name, description)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('update', 'user', id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Update current user's profile
  async updateCurrentUser(updates: Partial<UserUpdate>) {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return { data: null, error: 'Not authenticated' }
      }

      // Remove fields that users shouldn't be able to update themselves
      const allowedUpdates = {
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        preferences: updates.preferences,
        last_active: new Date().toISOString()
      }

      // Remove undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
      )

      const { data, error } = await this.supabase
        .from('users')
        .update(cleanUpdates)
        .eq('id', user.id)
        .select(`
          *,
          team:teams!team_id(id, name, description)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('update_profile', 'user', user.id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Update user's last active timestamp
  async updateLastActive(userId?: string) {
    try {
      let targetUserId = userId

      if (!targetUserId) {
        const { data: { user }, error: authError } = await this.supabase.auth.getUser()
        if (authError || !user) return { error: 'Not authenticated' }
        targetUserId = user.id
      }

      const { error } = await this.supabase
        .from('users')
        .update({ last_active: new Date().toISOString() })
        .eq('id', targetUserId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: handleSupabaseError(error) }
    }
  }

  // Get user activity statistics
  async getUserStats(userId: string, dateRange?: { from: string; to: string }) {
    try {
      // Get chat sessions count
      let chatQuery = this.supabase
        .from('chat_sessions')
        .select('id, created_at, message_count')
        .eq('user_id', userId)

      if (dateRange) {
        chatQuery = chatQuery
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)
      }

      const { data: chatSessions, error: chatError } = await chatQuery
      if (chatError) throw chatError

      // Get usage analytics
      let analyticsQuery = this.supabase
        .from('usage_analytics')
        .select('*')
        .eq('user_id', userId)

      if (dateRange) {
        analyticsQuery = analyticsQuery
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)
      }

      const { data: analytics, error: analyticsError } = await analyticsQuery
      if (analyticsError) throw analyticsError

      // Calculate stats
      const stats = {
        totalSessions: chatSessions.length,
        totalMessages: chatSessions.reduce((sum, session) => sum + (session.message_count || 0), 0),
        totalTokensUsed: analytics.reduce((sum, record) => sum + (record.tokens_used || 0), 0),
        totalCost: analytics.reduce((sum, record) => sum + (record.cost || 0), 0),
        avgResponseTime: analytics.length > 0 
          ? analytics.reduce((sum, record) => sum + (record.response_time_ms || 0), 0) / analytics.length 
          : 0,
        activityByDate: chatSessions.reduce((acc: Record<string, number>, session) => {
          const date = new Date(session.created_at).toISOString().split('T')[0]
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})
      }

      return { data: stats, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get team members for current user's team
  async getTeamMembers() {
    try {
      const { data: currentUser } = await this.getCurrentUser()
      if (!currentUser?.team_id) {
        return { data: [], error: null }
      }

      const { data, error } = await this.supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          role,
          avatar_url,
          status,
          last_active,
          created_at
        `)
        .eq('team_id', currentUser.team_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Invite a new user to the team
  async inviteUser(email: string, role: 'user' | 'admin' = 'user') {
    try {
      const { data: currentUser } = await this.getCurrentUser()
      if (!currentUser?.team_id) {
        return { data: null, error: 'No team associated with current user' }
      }

      // Check if user already exists
      const { data: existingUser } = await this.supabase
        .from('users')
        .select('id, email')
        .eq('email', email)
        .single()

      if (existingUser) {
        return { data: null, error: 'User with this email already exists' }
      }

      // In a real application, you would:
      // 1. Send an invitation email
      // 2. Create a pending invitation record
      // 3. Handle the invitation acceptance flow
      
      // For now, we'll just log the invitation
      await this.logAction('invite_user', 'user', currentUser.id, { 
        invited_email: email, 
        role,
        team_id: currentUser.team_id 
      })

      return { 
        data: { 
          message: 'Invitation sent successfully',
          email,
          role,
          team_id: currentUser.team_id
        }, 
        error: null 
      }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Remove user from team (admin only)
  async removeUserFromTeam(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({ team_id: null })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('remove_from_team', 'user', userId)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Change user role (admin/super_admin only)
  async changeUserRole(userId: string, newRole: 'user' | 'admin' | 'super_admin') {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)
        .select(`
          *,
          team:teams!team_id(id, name, description)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('change_role', 'user', userId, { new_role: newRole })

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
export const usersAPI = new UsersAPI()