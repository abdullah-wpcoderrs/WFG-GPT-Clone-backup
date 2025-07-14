"use client"

import type React from "react"

import { AuthProvider as AuthProviderHook } from "@/hooks/use-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProviderHook>{children}</AuthProviderHook>
}
