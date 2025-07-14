"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Users,
  MessageSquare,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Save,
  Shield,
  Bell,
  Trash2,
} from "lucide-react"

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
]

export default function AdminSettingsPage() {
  const { user } = useAuth()

  // Team Information
  const [teamName, setTeamName] = useState(user?.team_name || "")
  const [teamDescription, setTeamDescription] = useState("Strategic support and legal compliance team")

  // Access Control
  const [allowGuestAccess, setAllowGuestAccess] = useState(false)
  const [requireApproval, setRequireApproval] = useState(true)
  const [allowExternalSharing, setAllowExternalSharing] = useState(false)

  // Usage Limits
  const [monthlyTokenLimit, setMonthlyTokenLimit] = useState("50000")
  const [dailyChatLimit, setDailyChatLimit] = useState("100")
  const [maxFileSize, setMaxFileSize] = useState("10")

  // Notifications
  const [adminNotifications, setAdminNotifications] = useState(true)
  const [usageAlerts, setUsageAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)

  // Data Retention
  const [chatRetention, setChatRetention] = useState("90")
  const [logRetention, setLogRetention] = useState("365")
  const [autoArchive, setAutoArchive] = useState(true)

  const handleSaveTeamInfo = () => {
    console.log("Saving team info:", { teamName, teamDescription })
  }

  const handleSaveAccessControl = () => {
    console.log("Saving access control:", { allowGuestAccess, requireApproval, allowExternalSharing })
  }

  const handleSaveUsageLimits = () => {
    console.log("Saving usage limits:", { monthlyTokenLimit, dailyChatLimit, maxFileSize })
  }

  const handleSaveNotifications = () => {
    console.log("Saving notifications:", { adminNotifications, usageAlerts, weeklyReports })
  }

  const handleSaveDataRetention = () => {
    console.log("Saving data retention:", { chatRetention, logRetention, autoArchive })
  }

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Team Settings"
      description="Configure your team's preferences, permissions, and policies."
    >
      <div className="space-y-6">
        {/* Team Information */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#66BB6A]" />
              <CardTitle className="text-xl text-[#2C2C2C]">Team Information</CardTitle>
            </div>
            <CardDescription>Basic information about your team and its purpose.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Team ID</Label>
                <div className="flex items-center space-x-2">
                  <Input value={user?.team_id} disabled className="bg-gray-50" />
                  <Badge variant="secondary" className="text-xs">
                    Read-only
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-description">Team Description</Label>
              <Textarea
                id="team-description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="Describe your team's role and responsibilities..."
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveTeamInfo} className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#66BB6A]" />
              <CardTitle className="text-xl text-[#2C2C2C]">Access Control</CardTitle>
            </div>
            <CardDescription>Manage who can access your team's resources and how.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="guest-access" className="text-base font-medium">
                    Allow Guest Access
                  </Label>
                  <p className="text-sm text-gray-500">Allow non-team members to view public resources</p>
                </div>
                <Switch id="guest-access" checked={allowGuestAccess} onCheckedChange={setAllowGuestAccess} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-approval" className="text-base font-medium">
                    Require Admin Approval
                  </Label>
                  <p className="text-sm text-gray-500">New team members need admin approval to join</p>
                </div>
                <Switch id="require-approval" checked={requireApproval} onCheckedChange={setRequireApproval} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="external-sharing" className="text-base font-medium">
                    Allow External Sharing
                  </Label>
                  <p className="text-sm text-gray-500">Team members can share chats and documents externally</p>
                </div>
                <Switch
                  id="external-sharing"
                  checked={allowExternalSharing}
                  onCheckedChange={setAllowExternalSharing}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveAccessControl} className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Limits */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#66BB6A]" />
              <CardTitle className="text-xl text-[#2C2C2C]">Usage Limits</CardTitle>
            </div>
            <CardDescription>Set limits to control resource usage and costs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="token-limit">Monthly Token Limit</Label>
                <div className="relative">
                  <Input
                    id="token-limit"
                    value={monthlyTokenLimit}
                    onChange={(e) => setMonthlyTokenLimit(e.target.value)}
                    className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    tokens
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chat-limit">Daily Chat Limit</Label>
                <div className="relative">
                  <Input
                    id="chat-limit"
                    value={dailyChatLimit}
                    onChange={(e) => setDailyChatLimit(e.target.value)}
                    className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    chats
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-size">Max File Size</Label>
                <div className="relative">
                  <Input
                    id="file-size"
                    value={maxFileSize}
                    onChange={(e) => setMaxFileSize(e.target.value)}
                    className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">MB</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveUsageLimits} className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-[#66BB6A]" />
              <CardTitle className="text-xl text-[#2C2C2C]">Notifications</CardTitle>
            </div>
            <CardDescription>Configure notification preferences for team administrators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="admin-notifications" className="text-base font-medium">
                    Admin Notifications
                  </Label>
                  <p className="text-sm text-gray-500">Receive notifications about team activity and issues</p>
                </div>
                <Switch id="admin-notifications" checked={adminNotifications} onCheckedChange={setAdminNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="usage-alerts" className="text-base font-medium">
                    Usage Alerts
                  </Label>
                  <p className="text-sm text-gray-500">Get alerts when approaching usage limits</p>
                </div>
                <Switch id="usage-alerts" checked={usageAlerts} onCheckedChange={setUsageAlerts} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports" className="text-base font-medium">
                    Weekly Reports
                  </Label>
                  <p className="text-sm text-gray-500">Receive weekly team activity and usage reports</p>
                </div>
                <Switch id="weekly-reports" checked={weeklyReports} onCheckedChange={setWeeklyReports} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications} className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#66BB6A]" />
              <CardTitle className="text-xl text-[#2C2C2C]">Data Retention</CardTitle>
            </div>
            <CardDescription>Configure how long data is stored and when it's archived.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="chat-retention">Chat Retention Period</Label>
                <div className="relative">
                  <Input
                    id="chat-retention"
                    value={chatRetention}
                    onChange={(e) => setChatRetention(e.target.value)}
                    className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    days
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="log-retention">Log Retention Period</Label>
                <div className="relative">
                  <Input
                    id="log-retention"
                    value={logRetention}
                    onChange={(e) => setLogRetention(e.target.value)}
                    className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    days
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-archive" className="text-base font-medium">
                  Auto-Archive Old Data
                </Label>
                <p className="text-sm text-gray-500">Automatically archive data that exceeds retention periods</p>
              </div>
              <Switch id="auto-archive" checked={autoArchive} onCheckedChange={setAutoArchive} />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveDataRetention} className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              <CardTitle className="text-xl text-red-600">Danger Zone</CardTitle>
            </div>
            <CardDescription>Irreversible actions that affect your entire team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h4 className="font-medium text-red-900">Delete Team</h4>
                <p className="text-sm text-red-700">
                  Permanently delete this team and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                Delete Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
