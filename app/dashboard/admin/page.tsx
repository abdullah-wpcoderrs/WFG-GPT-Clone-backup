"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Brain,
  Users,
  MessageSquare,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  UserPlus,
  Upload,
  LayoutTemplate,
  Check,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Define navigation items for this dashboard section
const navigationItems = [
  {
    name: "Team Dashboard",
    href: "/dashboard/admin",
    icon: BarChart3,
    description: "Team overview & metrics",
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
    description: "User management & activity",
  },
  {
    name: "Chat Logs",
    href: "/dashboard/admin/logs",
    icon: MessageSquare,
    description: "Team conversation history",
  },
  {
    name: "Messages",
    href: "/dashboard/admin/messages",
    icon: MessageSquare,
    description: "Team conversations",
  },
  {
    name: "My Chats",
    href: "/dashboard/admin/chats",
    icon: MessageSquare,
    description: "My personal chat history",
  },
  {
    name: "Documents",
    href: "/dashboard/admin/documents",
    icon: FileText,
    description: "Team document library",
  },
  {
    name: "Prompt Templates",
    href: "/dashboard/admin/templates",
    icon: BookOpen,
    description: "Team prompt library",
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    description: "Team configuration",
  },
  {
    name: "Approvals",
    href: "/dashboard/admin/approvals",
    icon: Check,
    description: "Review approval requests",
  },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Team Dashboard"
      description="Manage your team's AI tools, members, and resources."
    >
      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">4</p>
                <p className="text-sm text-gray-600">GPTs Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">15</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">327</p>
                <p className="text-sm text-gray-600">Prompts This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">4.2s</p>
                <p className="text-sm text-gray-600">Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-[#E0E0E0] shadow-none mt-6">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center text-center bg-transparent"
            >
              <Link href="/dashboard/admin/gpts/new">
                <Plus className="h-6 w-6 mb-2 text-[#66BB6A]" />
                <span className="text-sm font-medium">Create New GPT</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center text-center bg-transparent"
            >
              <Link href="/dashboard/admin/members/invite">
                <UserPlus className="h-6 w-6 mb-2 text-[#66BB6A]" />
                <span className="text-sm font-medium">Invite New Member</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center text-center bg-transparent"
            >
              <Link href="/dashboard/admin/logs">
                <MessageSquare className="h-6 w-6 mb-2 text-[#66BB6A]" />
                <span className="text-sm font-medium">View Chat Logs</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center text-center bg-transparent"
            >
              <Link href="/dashboard/admin/documents/upload">
                <Upload className="h-6 w-6 mb-2 text-[#66BB6A]" />
                <span className="text-sm font-medium">Upload Document</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center text-center bg-transparent"
            >
              <Link href="/dashboard/admin/templates">
                <LayoutTemplate className="h-6 w-6 mb-2 text-[#66BB6A]" />
                <span className="text-sm font-medium">Manage Templates</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}