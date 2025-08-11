/**
 * Role-Based Access Control Utility
 * Handles permission checks for different user roles
 */

import type { User } from "@/types"

// Define roles
export type Role = "user" | "admin" | "super_admin"

// Define permissions
export type Permission = 
  | "view_memory"
  | "edit_memory"
  | "delete_memory"
  | "view_document_contexts"
  | "edit_document_contexts"
  | "delete_document_contexts"
  | "manage_gpts"
  | "manage_teams"
  | "view_analytics"
  | "manage_settings"

// Define role permissions
const rolePermissions: Record<Role, Permission[]> = {
  user: [
    "view_memory",
    "view_document_contexts"
  ],
  admin: [
    "view_memory",
    "edit_memory",
    "delete_memory",
    "view_document_contexts",
    "edit_document_contexts",
    "delete_document_contexts",
    "manage_gpts",
    "view_analytics"
  ],
  super_admin: [
    "view_memory",
    "edit_memory",
    "delete_memory",
    "view_document_contexts",
    "edit_document_contexts",
    "delete_document_contexts",
    "manage_gpts",
    "manage_teams",
    "view_analytics",
    "manage_settings"
  ]
}

/**
 * Check if a user has a specific permission
 * @param user The user to check
 * @param permission The permission to check for
 * @returns Whether the user has the permission
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false
  
  return rolePermissions[user.role as Role]?.includes(permission) || false
}

/**
 * Check if a user has a specific role
 * @param user The user to check
 * @param role The role to check for
 * @returns Whether the user has the role
 */
export function hasRole(user: User | null, role: Role): boolean {
  if (!user) return false
  
  return user.role === role
}

/**
 * Check if a user can manage memory
 * @param user The user to check
 * @returns Whether the user can manage memory
 */
export function canManageMemory(user: User | null): boolean {
  return hasPermission(user, "edit_memory")
}

/**
 * Check if a user can manage document contexts
 * @param user The user to check
 * @returns Whether the user can manage document contexts
 */
export function canManageDocumentContexts(user: User | null): boolean {
  return hasPermission(user, "edit_document_contexts")
}

/**
 * Check if a user can manage GPTs
 * @param user The user to check
 * @returns Whether the user can manage GPTs
 */
export function canManageGPTs(user: User | null): boolean {
  return hasPermission(user, "manage_gpts")
}

/**
 * Check if a user can manage teams
 * @param user The user to check
 * @returns Whether the user can manage teams
 */
export function canManageTeams(user: User | null): boolean {
  return hasPermission(user, "manage_teams")
}

/**
 * Check if a user can view analytics
 * @param user The user to check
 * @returns Whether the user can view analytics
 */
export function canViewAnalytics(user: User | null): boolean {
  return hasPermission(user, "view_analytics")
}

/**
 * Check if a user can manage settings
 * @param user The user to check
 * @returns Whether the user can manage settings
 */
export function canManageSettings(user: User | null): boolean {
  return hasPermission(user, "manage_settings")
}
