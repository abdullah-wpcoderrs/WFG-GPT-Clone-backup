import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, FileText, Users, BarChart3, BookOpen, Settings, History } from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard/admin",
    icon: BarChart3,
    description: "Overview of team performance",
  },
  {
    name: "Team GPTs",
    href: "/dashboard/admin/gpts",
    icon: Brain,
    description: "Manage team-specific AI assistants",
  },
  {
    name: "Team Members",
    href: "/dashboard/admin/members",
    icon: Users,
    description: "Manage team members and roles",
  },
  {
    name: "Documents",
    href: "/dashboard/admin/documents",
    icon: FileText,
    description: "Manage team documents",
  },
  {
    name: "Templates",
    href: "/dashboard/admin/templates",
    icon: BookOpen,
    description: "Manage team prompt templates",
  },
  {
    name: "Logs",
    href: "/dashboard/admin/logs",
    icon: History,
    description: "View team activity logs",
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    description: "Team settings and configuration",
  },
]

export default function AdminEditGPTLoading() {
  return (
    <DashboardLayout navigationItems={navigationItems} title="Edit Team GPT" description="Loading GPT configuration...">
      <div className="mb-4">
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Panel: Chat Interface Skeleton */}
        <div className="flex flex-col h-full">
          <Card className="flex flex-col flex-1 border-[#E0E0E0] shadow-none">
            <CardHeader className="border-b border-[#E0E0E0] p-4">
              <CardTitle className="text-xl text-[#2C2C2C] flex items-center gap-2">
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 overflow-y-auto space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
            <div className="border-t border-[#E0E0E0] p-4 flex items-center space-x-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
            </div>
          </Card>
        </div>

        {/* Right Panel: Configuration Skeleton */}
        <Card className="flex flex-col h-full border-[#E0E0E0] shadow-none">
          <CardHeader className="border-b border-[#E0E0E0] p-4">
            <CardTitle className="text-xl text-[#2C2C2C] flex items-center gap-2">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          </CardContent>
          <div className="border-t border-[#E0E0E0] p-4 flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
