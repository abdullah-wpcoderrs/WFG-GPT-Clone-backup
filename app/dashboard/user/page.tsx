"use client"

import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockGPTs, mockChatSessions } from "@/lib/mock-data" // Import mockChatSessions
import { Brain, MessageSquare, FolderOpen, FileText, Settings, TrendingUp, Users, Clock, User } from "lucide-react"
import Link from "next/link"

const navigationItems = [
  {
    name: "My Dashboard",
    href: "/dashboard/user",
    icon: User,
    description: "Personal overview",
  },
  {
    name: "Chat with GPTs",
    href: "/dashboard/user/chats",
    icon: MessageSquare,
    description: "AI conversations",
  },
  {
    name: "My Projects",
    href: "/dashboard/user/projects",
    icon: FolderOpen,
    description: "Project workspace",
  },
  {
    name: "My Docs",
    href: "/dashboard/user/documents",
    icon: FileText,
    description: "Document library",
  },
  {
    name: "My Prompts",
    href: "/dashboard/user/prompts",
    icon: Brain,
    description: "Saved prompts",
  },
  {
    name: "Settings",
    href: "/dashboard/user/settings",
    icon: Settings,
    description: "Account settings",
  },
]

export default function UserDashboard() {
  const { user } = useAuth()

  // Filter GPTs for user's team or organization-wide
  const userGPTs = mockGPTs.filter((gpt) => gpt.team_name === user?.team_name || gpt.team_name === "Organization-wide")

  // Get recent chats for the current user (assuming user-1 for mock data)
  const recentChats = mockChatSessions
    .filter((session) => session.user_id === "user-1")
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3) // Get the 3 most recent chats

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title={`Welcome back, ${user?.full_name?.split(" ")[0]}!`}
      description="Here are your available AI tools and recent activity."
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">12</p>
                <p className="text-sm text-gray-600">Chats This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{userGPTs.length}</p>
                <p className="text-sm text-gray-600">GPTs Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">4</p>
                <p className="text-sm text-gray-600">New Docs Shared</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">85%</p>
                <p className="text-sm text-gray-600">Productivity Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available GPT Tools */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">Available GPT Tools</CardTitle>
          <CardDescription>AI assistants assigned to your team and organization-wide tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userGPTs.map((gpt) => (
              <Card key={gpt.id} className="border-[#E0E0E0] shadow-none card-hover cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#B9E769] rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-[#2C2C2C]" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-[#2C2C2C]">{gpt.name}</h3>
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {gpt.team_name}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      className={`text-xs ${gpt.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {gpt.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{gpt.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Last used: {gpt.last_used}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {gpt.usage_count} uses
                    </div>
                  </div>

                  <Button asChild className="w-full btn-primary">
                    <Link href={`/dashboard/user/chats/${gpt.id}`}>Open Chat</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Chats */}
      <Card className="border-[#E0E0E0] shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-[#2C2C2C]">Recent Chats</CardTitle>
          <CardDescription>Your latest conversations with AI assistants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentChats.map((chat) => (
              <Link key={chat.id} href={`/dashboard/user/chats/session/${chat.id}`}>
                <div className="flex items-center justify-between p-4 border border-[#E0E0E0] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-[#B9E769] rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-[#2C2C2C]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2C2C2C]">{chat.title}</p>
                      <p className="text-sm text-gray-600">{chat.gpt_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{formatDate(chat.updated_at)}</p>
                    <p className="text-xs text-gray-500">{formatTime(chat.updated_at)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="border-[#E0E0E0] bg-transparent">
              <Link href="/dashboard/user/chats">View All Chats</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
