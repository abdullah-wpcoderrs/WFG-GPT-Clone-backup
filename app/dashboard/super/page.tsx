"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, Building2, FileText, BookOpen, BarChart3, Settings, Shield, MessageSquare } from "lucide-react"

const navigationItems = [
  {
    name: "Overview",
    href: "/dashboard/super",
    icon: BarChart3,
    description: "System-wide metrics",
  },
  {
    name: "All GPTs",
    href: "/dashboard/super/gpts",
    icon: Brain,
    description: "Org GPT management",
  },
  {
    name: "User Management",
    href: "/dashboard/super/users",
    icon: Users,
    description: "All users & permissions",
  },
  {
    name: "Teams & Units",
    href: "/dashboard/super/teams",
    icon: Building2,
    description: "Team structure",
  },
  {
    name: "Document Library",
    href: "/dashboard/super/documents",
    icon: FileText,
    description: "Document management",
  },
  {
    name: "Prompt Library",
    href: "/dashboard/super/prompts",
    icon: BookOpen,
    description: "Org Prompt templates",
  },
  // New navigation item for personal chat history
  {
    name: "Chat History", 
    href: "/dashboard/super/chats",
    icon: MessageSquare,
    description: "Chat logs",
  },
  {
    name: "System Settings",
    href: "/dashboard/super/settings",
    icon: Settings,
    description: "Platform configuration",
  },
  {
    name: "Security",
    href: "/dashboard/super/security",
    icon: Shield,
    description: "Access control & policies",
  },
]

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="System Overview"
      description="Monitor and manage the entire GPTWorkDesk platform."
    >
      <div className="space-y-6">
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">189</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">47</p>
                <p className="text-sm text-gray-600">GPTs Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">4,231</p>
                <p className="text-sm text-gray-600">Prompts (30d)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">582</p>
                <p className="text-sm text-gray-600">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">System Status</CardTitle>
          <CardDescription>Platform health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-600">API Status</p>
                <p className="text-lg font-semibold text-[#2C2C2C]">Operational</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-[#66BB6A]" />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-600">Database</p>
                <p className="text-lg font-semibold text-[#2C2C2C]">Healthy</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-[#66BB6A]" />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Queues</p>
                <p className="text-lg font-semibold text-[#2C2C2C]">Normal</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-[#66BB6A]" />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Usage</p>
                <p className="text-lg font-semibold text-[#2C2C2C]">75%</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-[#FFC107]" />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Backup</p>
                <p className="text-lg font-semibold text-[#2C2C2C]">2 hours ago</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-[#66BB6A]" />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-lg font-semibold text-[#2C2C2C]">0.01%</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-[#66BB6A]" />
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  )
}
