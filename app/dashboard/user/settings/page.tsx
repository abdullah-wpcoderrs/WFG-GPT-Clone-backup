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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, MessageSquare, FolderOpen, BookOpen, FileText, Settings, Save, User, Bell, Shield } from "lucide-react"

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

export default function SettingsPage() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState(user?.full_name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [chatNotifications, setChatNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  // Privacy preferences
  const [shareActivity, setShareActivity] = useState(false)
  const [allowAnalytics, setAllowAnalytics] = useState(true)

  const handleSaveProfile = () => {
    // In a real app, this would update the profile via API
    console.log("Saving profile:", { fullName, email, bio })
  }

  const handleChangePassword = () => {
    // In a real app, this would change the password via API
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match")
      return
    }
    console.log("Changing password")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Settings"
      description="Manage your profile, preferences, and account settings."
    >
      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-[#66BB6A]" />
              <CardTitle className="text-xl text-[#2C2C2C]">Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal information and profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-[#B9E769] text-[#2C2C2C] text-xl font-medium">
                  {user?.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" className="mb-2 bg-transparent">
                  Change Avatar
                </Button>
                <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself..."
                className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#66BB6A]" />
              <CardTitle className="text-xl text-[#2C2C2C]">Password & Security</CardTitle>
            </div>
            <CardDescription>Update your password and security preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleChangePassword} className="btn-primary">
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-[#66BB6A]" />
              <CardTitle className="text-xl text-[#2C2C2C]">Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="chat-notifications" className="text-base font-medium">
                    Chat Notifications
                  </Label>
                  <p className="text-sm text-gray-500">Get notified when GPTs respond to your messages</p>
                </div>
                <Switch id="chat-notifications" checked={chatNotifications} onCheckedChange={setChatNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-digest" className="text-base font-medium">
                    Weekly Digest
                  </Label>
                  <p className="text-sm text-gray-500">Receive a weekly summary of your activity</p>
                </div>
                <Switch id="weekly-digest" checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#66BB6A]" />
              <CardTitle className="text-xl text-[#2C2C2C]">Privacy & Data</CardTitle>
            </div>
            <CardDescription>Control your privacy settings and data sharing preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="share-activity" className="text-base font-medium">
                    Share Activity
                  </Label>
                  <p className="text-sm text-gray-500">Allow admins to view your chat activity for analytics</p>
                </div>
                <Switch id="share-activity" checked={shareActivity} onCheckedChange={setShareActivity} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-analytics" className="text-base font-medium">
                    Usage Analytics
                  </Label>
                  <p className="text-sm text-gray-500">Help improve the platform by sharing anonymous usage data</p>
                </div>
                <Switch id="allow-analytics" checked={allowAnalytics} onCheckedChange={setAllowAnalytics} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="border-[#E0E0E0] shadow-none">
          <CardHeader>
            <CardTitle className="text-xl text-[#2C2C2C]">Account Information</CardTitle>
            <CardDescription>View your account details and team assignment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">Role</Label>
                <p className="text-base text-[#2C2C2C] capitalize">{user?.role?.replace("_", " ")}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Team</Label>
                <p className="text-base text-[#2C2C2C]">{user?.team_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">User ID</Label>
                <p className="text-base text-[#2C2C2C] font-mono">{user?.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Account Status</Label>
                <p className="text-base text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
