"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare,
  FileText,
  FolderOpen,
  Clock,
  Users,
  ArrowRight,
  Bot,
  Brain,
  BookOpen,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { mockProjects, mockDocuments, mockChatSessions } from "@/lib/mock-data"
import { mockGPTs } from "@/lib/mock-gpts"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard/user",
    icon: Brain,
    description: "Overview",
  },
  {
    name: "Messages",
    href: "/dashboard/user/messages",
    icon: MessageSquare,
    description: "Team conversations",
  },
  {
    name: "My Chats",
    href: "/dashboard/user/chats",
    icon: MessageSquare,
    description: "AI chat history",
  },
  {
    name: "My Projects",
    href: "/dashboard/user/projects",
    icon: FolderOpen,
    description: "Organized chat folders",
  },
  {
    name: "Prompt Library",
    href: "/dashboard/user/prompts",
    icon: BookOpen,
    description: "Saved prompt",
  },
  {
    name: "Team Documents",
    href: "/dashboard/user/documents",
    icon: FileText,
    description: "Shared team files",
  },
  {
    name: "Settings",
    href: "/dashboard/user/settings",
    icon: Settings,
    description: "Profile & preferences",
  },
]

export default function UserDashboard() {
  const { user } = useAuth()

  // Get recent items (last 3)
  const recentProjects = mockProjects.slice(0, 3)
  const recentDocuments = mockDocuments.slice(0, 3)
  const recentChats = mockChatSessions
    .filter((chat) => chat.userId === "1") // Current user's chats
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  const stats = [
    {
      title: "Active Projects",
      value: "3",
      change: "+2 this week",
      icon: FolderOpen,
      color: "text-blue-600",
    },
    {
      title: "Documents",
      value: "24",
      change: "+5 this week",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Chat Sessions",
      value: "12",
      change: "+3 this week",
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      title: "Team Members",
      value: "8",
      change: "No change",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title={`Welcome back, ${user?.full_name?.split(" ")[0] || "John"}!`}
      description="Here's what's happening with your projects today."
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Projects */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Projects</CardTitle>
                <CardDescription>Your latest project activity</CardDescription>
              </div>
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                  </div>
                  <Badge variant={project.status === "active" ? "default" : "secondary"} className="text-xs">
                    {project.status}
                  </Badge>
                </div>
              ))}
              <Link href="/dashboard/user/projects">
                <Button variant="ghost" className="w-full justify-between text-sm">
                  View all projects
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Documents</CardTitle>
                <CardDescription>Recently accessed files</CardDescription>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(doc.size / 1024 / 1024).toFixed(1)} MB • {doc.type.toUpperCase()}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
              <Link href="/dashboard/user/documents">
                <Button variant="ghost" className="w-full justify-between text-sm">
                  View all documents
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Chats */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Chats</CardTitle>
                <CardDescription>Your latest AI conversations</CardDescription>
              </div>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {recentChats.map((chat) => {
                const gpt = mockGPTs.find((g) => g.id === chat.gptId)
                return (
                  <Link
                    key={chat.id}
                    href={`/dashboard/user/chats/session/${chat.id}`}
                    className="block hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{chat.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {gpt?.name} • {chat.messageCount} messages
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                )
              })}
              <Link href="/dashboard/user/chats">
                <Button variant="ghost" className="w-full justify-between text-sm">
                  View all chats
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Activity</CardTitle>
              <CardDescription>Your productivity this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Projects worked on</span>
                  <span>3/5</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Documents created</span>
                  <span>8/10</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Chat sessions</span>
                  <span>12/15</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/user/projects">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </Link>
              <Link href="/dashboard/user/messages">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Team Conversation
                </Button>
              </Link>
              <Link href="/dashboard/user/chats">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start AI Chat
                </Button>
              </Link>
              <Link href="/dashboard/user/documents">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}