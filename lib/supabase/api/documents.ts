import { createSupabaseClient, handleSupabaseError } from '../client'
import type { Database } from '../database.types'

type Document = Database['public']['Tables']['documents']['Row']
type DocumentInsert = Database['public']['Tables']['documents']['Insert']
type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export class DocumentsAPI {
  private supabase = createSupabaseClient()

  // Get all documents accessible to the current user
  async getDocuments(filters?: {
    teamId?: string
    gptId?: string
    uploadedBy?: string
    fileType?: string
    search?: string
    limit?: number
    offset?: number
  }) {
    try {
      let query = this.supabase
        .from('documents')
        .select(`
          *,
          uploader:users!uploaded_by(id, full_name, email),
          team:teams!team_id(id, name),
          gpt:gpts!gpt_id(id, name)
        `)

      // Apply filters
      if (filters?.teamId) {
        query = query.eq('team_id', filters.teamId)
      }
      if (filters?.gptId) {
        query = query.eq('gpt_id', filters.gptId)
      }
      if (filters?.uploadedBy) {
        query = query.eq('uploaded_by', filters.uploadedBy)
      }
      if (filters?.fileType) {
        query = query.eq('file_type', filters.fileType)
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`)
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

  // Get a single document by ID
  async getDocument(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select(`
          *,
          uploader:users!uploaded_by(id, full_name, email),
          team:teams!team_id(id, name),
          gpt:gpts!gpt_id(id, name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Upload a new document
  async uploadDocument(document: DocumentInsert) {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .insert(document)
        .select(`
          *,
          uploader:users!uploaded_by(id, full_name, email),
          team:teams!team_id(id, name),
          gpt:gpts!gpt_id(id, name)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('upload', 'document', data.id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Update a document
  async updateDocument(id: string, updates: DocumentUpdate) {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          uploader:users!uploaded_by(id, full_name, email),
          team:teams!team_id(id, name),
          gpt:gpts!gpt_id(id, name)
        `)
        .single()

      if (error) throw error

      // Log the action
      await this.logAction('update', 'document', id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Delete a document
  async deleteDocument(id: string) {
    try {
      const { error } = await this.supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Log the action
      await this.logAction('delete', 'document', id)

      return { error: null }
    } catch (error) {
      return { error: handleSupabaseError(error) }
    }
  }

  // Get document statistics
  async getDocumentStats(teamId?: string) {
    try {
      let query = this.supabase
        .from('documents')
        .select('file_type, file_size, created_at')

      if (teamId) {
        query = query.eq('team_id', teamId)
      }

      const { data, error } = await query

      if (error) throw error

      // Calculate stats
      const stats = {
        totalDocuments: data.length,
        totalSize: data.reduce((sum, doc) => sum + (doc.file_size || 0), 0),
        fileTypes: data.reduce((acc: Record<string, number>, doc) => {
          const type = doc.file_type || 'unknown'
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {}),
        uploadsByDate: data.reduce((acc: Record<string, number>, doc) => {
          const date = new Date(doc.created_at).toISOString().split('T')[0]
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})
      }

      return { data: stats, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Upload file to Supabase Storage
  async uploadFile(file: File, bucket = 'gpt-desk-files', folder = 'documents') {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return { 
        data: { 
          path: data.path, 
          publicUrl,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }, 
        error: null 
      }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  }

  // Delete file from Supabase Storage
  async deleteFile(filePath: string, bucket = 'gpt-desk-files') {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: handleSupabaseError(error) }
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
export const documentsAPI = new DocumentsAPI()