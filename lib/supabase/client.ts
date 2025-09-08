import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Single Supabase client instance for client-side usage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Client-side Supabase client factory function
export const createSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client
export const createSupabaseServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Admin client for server-side operations that bypass RLS
export const createSupabaseAdminClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Utility function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  
  if (error?.code === 'PGRST301') {
    return 'Unauthorized access'
  }
  
  if (error?.code === 'PGRST116') {
    return 'Resource not found'
  }
  
  if (error?.code === '23505') {
    return 'Resource already exists'
  }
  
  if (error?.code === '23503') {
    return 'Referenced resource not found'
  }
  
  return error?.message || 'An unexpected error occurred'
}

// Utility function to get current user with profile
export const getCurrentUserWithProfile = async (supabase: any) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { user: null, profile: null, error: authError }
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select(`
      *,
      teams (
        id,
        name,
        description
      )
    `)
    .eq('id', user.id)
    .single()
  
  return { user, profile, error: profileError }
}