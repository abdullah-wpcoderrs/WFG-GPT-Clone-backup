"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createSupabaseClient, getCurrentUserWithProfile } from "@/lib/supabase/client"
import { usersAPI } from "@/lib/supabase/api/users"
import type { Database } from "@/lib/supabase/database.types"

type User = Database['public']['Tables']['users']['Row'] & {
  auth_user?: any
  team?: {
    id: string
    name: string
    description: string | null
    member_count?: number
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          await loadUserProfile(session.user.id)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Load user profile from database
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await usersAPI.getUser(userId)
      
      if (error) {
        console.error('Error loading user profile:', error)
        setUser(null)
      } else {
        setUser(data)
        // Update last active timestamp
        await usersAPI.updateLastActive(userId)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setLoading(false)
        return { error: error.message }
      }

      // User profile will be loaded by the auth state change listener
      return {}
    } catch (error: any) {
      setLoading(false)
      return { error: error.message || 'An unexpected error occurred' }
    }
  }

  // Sign up with email, password, and full name
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) {
        setLoading(false)
        return { error: error.message }
      }

      // If email confirmation is disabled, the user will be signed in immediately
      // Otherwise, they need to confirm their email first
      if (data.user && !data.user.email_confirmed_at) {
        setLoading(false)
        return { error: 'Please check your email to confirm your account' }
      }

      return {}
    } catch (error: any) {
      setLoading(false)
      return { error: error.message || 'An unexpected error occurred' }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
      }
      
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) {
        return { error: 'No user logged in' }
      }

      const { data, error } = await usersAPI.updateCurrentUser(updates)
      
      if (error) {
        return { error }
      }

      setUser(data)
      return {}
    } catch (error: any) {
      return { error: error.message || 'Failed to update profile' }
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

// Utility hook for checking user permissions
export function usePermissions() {
  const { user } = useSupabaseAuth()

  const isUser = user?.role === 'user'
  const isAdmin = user?.role === 'admin'
  const isSuperAdmin = user?.role === 'super_admin'
  const isAdminOrSuper = isAdmin || isSuperAdmin

  const canManageTeam = isAdminOrSuper
  const canManageUsers = isAdminOrSuper
  const canViewAnalytics = isAdminOrSuper
  const canManageGPTs = true // All users can manage GPTs
  const canDeleteGPTs = isAdminOrSuper
  const canViewAuditLogs = isAdminOrSuper

  return {
    isUser,
    isAdmin,
    isSuperAdmin,
    isAdminOrSuper,
    canManageTeam,
    canManageUsers,
    canViewAnalytics,
    canManageGPTs,
    canDeleteGPTs,
    canViewAuditLogs
  }
}