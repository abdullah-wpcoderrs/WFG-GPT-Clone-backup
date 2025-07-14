"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { TopNavigation } from "./top-navigation"
import { SidebarNavigation } from "./sidebar-navigation"
import { MainContent } from "./main-content"

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  title?: string
  description?: string
}

export function DashboardLayout({ children, navigationItems, title, description }: DashboardLayoutProps) {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="h-screen flex flex-col">
      <TopNavigation />

      <div className="flex-1 flex overflow-hidden">
        <SidebarNavigation items={navigationItems} />
        <MainContent title={title} description={description}>
          {children}
        </MainContent>
      </div>
    </div>
  )
}
