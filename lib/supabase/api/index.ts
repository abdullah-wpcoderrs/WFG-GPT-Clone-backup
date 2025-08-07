// Export all API services
export { gptsAPI, GPTsAPI } from './gpts'
export { chatAPI, ChatAPI } from './chat'
export { usersAPI, UsersAPI } from './users'
export { documentsAPI, DocumentsAPI } from './documents'
export { templatesAPI, TemplatesAPI } from './templates'
export { analyticsAPI, AnalyticsAPI } from './analytics'

// Export client utilities
export { 
  createSupabaseClient, 
  createSupabaseServerClient, 
  createSupabaseAdminClient,
  handleSupabaseError,
  getCurrentUserWithProfile
} from '../client'

// Export types
export type { Database } from '../database.types'

// Utility function to initialize all APIs with a custom client
export function createAPIServices(supabaseClient?: any) {
  if (!supabaseClient) {
    // Return the default singleton instances
    return {
      gpts: gptsAPI,
      chat: chatAPI,
      users: usersAPI,
      documents: documentsAPI,
      templates: templatesAPI,
      analytics: analyticsAPI
    }
  }

  // Create new instances with custom client
  return {
    gpts: new GPTsAPI(),
    chat: new ChatAPI(),
    users: new UsersAPI(),
    documents: new DocumentsAPI(),
    templates: new TemplatesAPI(),
    analytics: new AnalyticsAPI()
  }
}

// Convenience function to get all API endpoints
export function getAPIEndpoints() {
  return {
    // GPTs
    gpts: {
      list: '/api/supabase/gpts',
      create: '/api/supabase/gpts',
      get: (id: string) => `/api/supabase/gpts/${id}`,
      update: (id: string) => `/api/supabase/gpts/${id}`,
      delete: (id: string) => `/api/supabase/gpts/${id}`,
    },
    
    // Chat Sessions
    chat: {
      sessions: '/api/supabase/chat/sessions',
      createSession: '/api/supabase/chat/sessions',
      getSession: (id: string) => `/api/supabase/chat/sessions/${id}`,
      updateSession: (id: string) => `/api/supabase/chat/sessions/${id}`,
      deleteSession: (id: string) => `/api/supabase/chat/sessions/${id}`,
      messages: (sessionId: string) => `/api/supabase/chat/sessions/${sessionId}/messages`,
    },
    
    // Users
    users: {
      list: '/api/supabase/users',
      me: '/api/supabase/users/me',
      get: (id: string) => `/api/supabase/users/${id}`,
      update: (id: string) => `/api/supabase/users/${id}`,
    },
    
    // Documents
    documents: {
      list: '/api/supabase/documents',
      upload: '/api/supabase/documents',
      get: (id: string) => `/api/supabase/documents/${id}`,
      update: (id: string) => `/api/supabase/documents/${id}`,
      delete: (id: string) => `/api/supabase/documents/${id}`,
    },
    
    // Templates
    templates: {
      list: '/api/supabase/templates',
      create: '/api/supabase/templates',
      get: (id: string) => `/api/supabase/templates/${id}`,
      update: (id: string) => `/api/supabase/templates/${id}`,
      delete: (id: string) => `/api/supabase/templates/${id}`,
      use: (id: string) => `/api/supabase/templates/${id}/use`,
    },
    
    // Analytics
    analytics: {
      dashboard: '/api/supabase/analytics?type=dashboard',
      usage: '/api/supabase/analytics?type=usage',
      costs: '/api/supabase/analytics?type=costs',
      audit: '/api/supabase/analytics?type=audit',
    }
  }
}