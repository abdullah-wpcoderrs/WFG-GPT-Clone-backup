"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Brain, Users, FileText, BookOpen, BarChart3, Settings, MessageSquare } from "lucide-react"

const navigationItems = [
  {
    name: "Team Dashboard",
    href: "/dashboard/admin",
    icon: BarChart3,
    description: "Team performance metrics",
  },
  {
    name: "Team GPTs",
    href: "/dashboard/admin/gpts",
    icon: Brain,
    description: "Manage team AI assistants",
  },
  {
    name: "Team Members",
    href: "/dashboard/admin/members",
    icon: Users,
    description: "Manage team members",
  },
  {
    name: "Documents",
    href: "/dashboard/admin/documents",
    icon: FileText,
    description: "Team document library",
  },
  {
    name: "Templates",
    href: "/dashboard/admin/templates",
    icon: BookOpen,
    description: "Team prompt templates",
  },
  {
    name: "Chat History",
    href: "/dashboard/admin/chats",
    icon: MessageSquare,
    description: "Team chat conversations",
  },
  {
    name: "Activity Logs",
    href: "/dashboard/admin/logs",
    icon: FileText,
    description: "Team activity monitoring",
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    description: "Team configuration",
  },
]

export default function AdminEditGPTLoading() {
  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Edit Team GPT"
      description="Modify team AI assistant configuration."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Chat Interface Skeleton */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-end">
                <Skeleton className="h-16 w-3/4 rounded-lg" />
              </div>
              <div className="flex justify-start">
                <Skeleton className="h-20 w-4/5 rounded-lg" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-12 w-2/3 rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form Skeleton */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
