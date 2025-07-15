import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Brain,
  Users,
  MessageSquare,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  ShieldCheck,
  Building2,
} from "lucide-react"

const navigationItems = [
  {
    name: "Organization Dashboard",
    href: "/dashboard/super",
    icon: BarChart3,
    description: "Overall platform metrics",
  },
  {
    name: "Organization GPTs",
    href: "/dashboard/super/gpts",
    icon: Brain,
    description: "Manage all AI assistants",
  },
  {
    name: "Users",
    href: "/dashboard/super/users",
    icon: Users,
    description: "Manage all platform users",
  },
  {
    name: "Teams",
    href: "/dashboard/super/teams",
    icon: Building2,
    description: "Manage organizational teams",
  },
  {
    name: "Documents",
    href: "/dashboard/super/documents",
    icon: FileText,
    description: "Manage all platform documents",
  },
  {
    name: "Prompt Templates",
    href: "/dashboard/super/prompts",
    icon: BookOpen,
    description: "Manage all prompt templates",
  },
  {
    name: "Chat Logs",
    href: "/dashboard/super/chats",
    icon: MessageSquare,
    description: "View all chat conversations",
  },
  {
    name: "Security",
    href: "/dashboard/super/security",
    icon: ShieldCheck,
    description: "Platform security settings",
  },
  {
    name: "Settings",
    href: "/dashboard/super/settings",
    icon: Settings,
    description: "Platform-wide configurations",
  },
]

export default function SuperAdminEditGPTLoading() {
  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Loading GPT..."
      description="Please wait while we load the GPT details."
    >
      <div className="mb-4">
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Panel: Chat Interface Skeleton */}
        <div className="flex flex-col h-full">
          <Card className="flex flex-col flex-1 border-[#E0E0E0] shadow-none">
            <CardHeader className="border-b border-[#E0E0E0] p-4">
              <CardTitle className="text-xl text-[#2C2C2C]">
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 overflow-y-auto space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
            <div className="border-t border-[#E0E0E0] p-4 flex items-center gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
            </div>
          </Card>
        </div>

        {/* Right Panel: Configuration Skeleton */}
        <Card className="flex flex-col h-full border-[#E0E0E0] shadow-none">
          <CardHeader className="border-b border-[#E0E0E0] p-4">
            <CardTitle className="text-xl text-[#2C2C2C]">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>

            <Skeleton className="h-px w-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>

            <Skeleton className="h-px w-full" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
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
