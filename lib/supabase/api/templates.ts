import { createSupabaseClient, handleSupabaseError } from '../client'
import type { Database } from '../database.types'

type Template = Database['public']['Tables']['templates']['Row']
type TemplateInsert = Database['public']['Tables']['templates']['Insert']
type TemplateUpdate = Database['public']['Tables']['templates']['Update']

export class TemplatesAPI {
  private supabase = createSupabaseClient()

  // Get all templates accessible to the current user
  async getTemplates(filters?: {
    teamId?: string
    category?: string
    createdBy?: string
    isPublic?: boolean
    search?: string
    limit?: number
    offset?: number
  }) {
    try {
      let query = this.supabase
        .from('templates')
        .select(`
          *,
          creator:users!created_by(id, full_name, email),
          team:teams!team_id(id, name)
        `)

      // Apply filters
      if (filters?.teamId) {
        query = query.eq('team_id', filters.teamId)
      }
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.createdBy) {
        query = query.eq('created_by', filters.createdBy)
      }
      if (filters?.isPublic !== undefined) {
        query = query.eq('is_public', filters.isPublic)
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

      // Order by usage_count desc, then created_at desc
      query = query.order('usage_count', { ascending: false })
                   .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get a single template by ID
  async getTemplate(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .select(`
          *,
          creator:users!created_by(id, full_name, email),
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

  // Create a new template
  async createTemplate(template: TemplateInsert) {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .insert(template)
        .select(`
          *,
          creator:users!created_by(id, full_name, email),
          team:teams!team_id(id, name)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('create', 'template', data.id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Update a template
  async updateTemplate(id: string, updates: TemplateUpdate) {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          creator:users!created_by(id, full_name, email),
          team:teams!team_id(id, name)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('update', 'template', id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Delete a template
  async deleteTemplate(id: string) {
    try {
      const { error } = await this.supabase
        .from('templates')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Log the action
      await this.logAction('delete', 'template', id)

      return { error: null }
    } catch (error) {
      return { error: handleSupabaseError(error) }
    }
  }

  // Use a template (increment usage count)
  async useTemplate(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .update({ usage_count: this.supabase.sql`usage_count + 1` })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('use', 'template', id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get popular templates
  async getPopularTemplates(limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .select(`
          *,
          creator:users!created_by(id, full_name, email),
          team:teams!team_id(id, name)
        `)
        .eq('is_public', true)
        .order('usage_count', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get templates by category
  async getTemplatesByCategory() {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .select('category, id, name, description, usage_count')
        .not('category', 'is', null)
        .order('category')
        .order('usage_count', { ascending: false })

      if (error) throw error

      // Group by category
      const grouped = data.reduce((acc: Record<string, any[]>, template) => {
        const category = template.category || 'Other'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(template)
        return acc
      }, {})

      return { data: grouped, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Search templates
  async searchTemplates(query: string, filters?: {
    category?: string
    isPublic?: boolean
    limit?: number
  }) {
    try {
      let searchQuery = this.supabase
        .from('templates')
        .select(`
          *,
          creator:users!created_by(id, full_name, email),
          team:teams!team_id(id, name)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)

      // Apply filters
      if (filters?.category) {
        searchQuery = searchQuery.eq('category', filters.category)
      }
      if (filters?.isPublic !== undefined) {
        searchQuery = searchQuery.eq('is_public', filters.isPublic)
      }
      if (filters?.limit) {
        searchQuery = searchQuery.limit(filters.limit)
      }

      searchQuery = searchQuery.order('usage_count', { ascending: false })

      const { data, error } = await searchQuery

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Duplicate a template
  async duplicateTemplate(id: string, newName?: string) {
    try {
      // Get the original template
      const { data: original, error: fetchError } = await this.getTemplate(id)
      if (fetchError || !original) {
        return { data: null, error: fetchError || 'Template not found' }
      }

      // Create a copy
      const duplicateData: TemplateInsert = {
        name: newName || `${original.name} (Copy)`,
        description: original.description,
        content: original.content,
        category: original.category,
        created_by: original.created_by,
        team_id: original.team_id,
        tags: original.tags,
        variables: original.variables,
        is_public: false, // Duplicates are private by default
      }

      const { data, error } = await this.createTemplate(duplicateData)

      if (error) throw error

      // Log the action
      await this.logAction('duplicate', 'template', id, { new_template_id: data.id })

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Get template statistics
  async getTemplateStats(teamId?: string) {
    try {
      let query = this.supabase
        .from('templates')
        .select('category, usage_count, created_at, is_public')

      if (teamId) {
        query = query.eq('team_id', teamId)
      }

      const { data, error } = await query

      if (error) throw error

      // Calculate stats
      const stats = {
        totalTemplates: data.length,
        publicTemplates: data.filter(t => t.is_public).length,
        privateTemplates: data.filter(t => !t.is_public).length,
        totalUsage: data.reduce((sum, template) => sum + (template.usage_count || 0), 0),
        categoryCounts: data.reduce((acc: Record<string, number>, template) => {
          const category = template.category || 'Other'
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {}),
        usageByCategory: data.reduce((acc: Record<string, number>, template) => {
          const category = template.category || 'Other'
          acc[category] = (acc[category] || 0) + (template.usage_count || 0)
          return acc
        }, {}),
        createdByDate: data.reduce((acc: Record<string, number>, template) => {
          const date = new Date(template.created_at).toISOString().split('T')[0]
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})
      }

      return { data: stats, error: null }
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
export const templatesAPI = new TemplatesAPI()