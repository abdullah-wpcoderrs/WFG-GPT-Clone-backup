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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Users,
  Building2,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  Globe,
  Database,
  Mail,
  Key,
  Server,
  Zap,
  Info,
  MessageSquare,
} from "lucide-react"

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

export default function SuperSettingsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // General Settings
  const [organizationName, setOrganizationName] = useState("GPTWorkDesk Organization")
  const [organizationDescription, setOrganizationDescription] = useState("AI-powered workplace productivity platform")
  const [organizationWebsite, setOrganizationWebsite] = useState("https://gptworkdesk.com")
  const [organizationLogo, setOrganizationLogo] = useState("")
  const [timezone, setTimezone] = useState("UTC")
  const [language, setLanguage] = useState("en")

  // Feature Settings
  const [enableGPTCreation, setEnableGPTCreation] = useState(true)
  const [enableDocumentSharing, setEnableDocumentSharing] = useState(true)
  const [enablePromptLibrary, setEnablePromptLibrary] = useState(true)
  const [enableTeamCollaboration, setEnableTeamCollaboration] = useState(true)
  const [enableAnalytics, setEnableAnalytics] = useState(true)
  const [enableNotifications, setEnableNotifications] = useState(true)

  // API Settings
  const [openaiApiKey, setOpenaiApiKey] = useState("sk-...")
  const [anthropicApiKey, setAnthropicApiKey] = useState("")
  const [googleApiKey, setGoogleApiKey] = useState("")
  const [maxTokensPerRequest, setMaxTokensPerRequest] = useState("4000")
  const [rateLimitPerUser, setRateLimitPerUser] = useState("100")
  const [rateLimitWindow, setRateLimitWindow] = useState("hour")

  // Email Settings
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com")
  const [smtpPort, setSmtpPort] = useState("587")
  const [smtpUsername, setSmtpUsername] = useState("")
  const [smtpPassword, setSmtpPassword] = useState("")
  const [fromEmail, setFromEmail] = useState("noreply@gptworkdesk.com")
  const [fromName, setFromName] = useState("GPTWorkDesk")

  // Storage Settings
  const [storageProvider, setStorageProvider] = useState("local")
  const [maxFileSize, setMaxFileSize] = useState("10")
  const [allowedFileTypes, setAllowedFileTypes] = useState("pdf,doc,docx,txt,csv,xlsx,ppt,pptx")
  const [storageQuotaPerUser, setStorageQuotaPerUser] = useState("1000")

  // Security Settings
  const [requireMFA, setRequireMFA] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("24")
  const [passwordMinLength, setPasswordMinLength] = useState("8")
  const [requirePasswordComplexity, setRequirePasswordComplexity] = useState(true)
  const [allowedDomains, setAllowedDomains] = useState("")
  const [enableAuditLog, setEnableAuditLog] = useState(true)

  const handleSaveSettings = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setHasChanges(false)
    console.log("Settings saved")
  }

  const handleResetSettings = () => {
    // Reset to default values
    setHasChanges(false)
    console.log("Settings reset")
  }

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="System Settings"
      description="Configure platform-wide settings and preferences."
    >
      <div className="space-y-6">
        {/* Save/Reset Actions */}
        {hasChanges && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. Don't forget to save your settings.
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleSaveSettings} disabled={isLoading} className="btn-primary">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleResetSettings}>
                  Reset Changes
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="api">API & AI</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="border-[#E0E0E0] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Organization Information</span>
                </CardTitle>
                <CardDescription>Basic information about your organization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      value={organizationName}
                      onChange={(e) => {
                        setOrganizationName(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-website">Website</Label>
                    <Input
                      id="org-website"
                      value={organizationWebsite}
                      onChange={(e) => {
                        setOrganizationWebsite(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-description">Description</Label>
                  <Textarea
                    id="org-description"
                    value={organizationDescription}
                    onChange={(e) => {
                      setOrganizationDescription(e.target.value)
                      setHasChanges(true)
                    }}
                    className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      value={timezone}
                      onChange={(e) => {
                        setTimezone(e.target.value)
                        setHasChanges(true)
                      }}
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <select
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value)
                        setHasChanges(true)
                      }}
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Settings */}
          <TabsContent value="features" className="space-y-6">
            <Card className="border-[#E0E0E0] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Platform Features</span>
                </CardTitle>
                <CardDescription>Enable or disable platform features for all users.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>GPT Creation</Label>
                      <p className="text-sm text-gray-500">Allow users to create custom GPTs</p>
                    </div>
                    <Switch
                      checked={enableGPTCreation}
                      onCheckedChange={(checked) => {
                        setEnableGPTCreation(checked)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Document Sharing</Label>
                      <p className="text-sm text-gray-500">Enable document upload and sharing</p>
                    </div>
                    <Switch
                      checked={enableDocumentSharing}
                      onCheckedChange={(checked) => {
                        setEnableDocumentSharing(checked)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Prompt Library</Label>
                      <p className="text-sm text-gray-500">Allow users to create and share prompts</p>
                    </div>
                    <Switch
                      checked={enablePromptLibrary}
                      onCheckedChange={(checked) => {
                        setEnablePromptLibrary(checked)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Team Collaboration</Label>
                      <p className="text-sm text-gray-500">Enable team features and collaboration tools</p>
                    </div>
                    <Switch
                      checked={enableTeamCollaboration}
                      onCheckedChange={(checked) => {
                        setEnableTeamCollaboration(checked)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Analytics & Reporting</Label>
                      <p className="text-sm text-gray-500">Enable usage analytics and reporting</p>
                    </div>
                    <Switch
                      checked={enableAnalytics}
                      onCheckedChange={(checked) => {
                        setEnableAnalytics(checked)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications</Label>
                      <p className="text-sm text-gray-500">Enable email and in-app notifications</p>
                    </div>
                    <Switch
                      checked={enableNotifications}
                      onCheckedChange={(checked) => {
                        setEnableNotifications(checked)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api" className="space-y-6">
            <Card className="border-[#E0E0E0] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>AI Provider API Keys</span>
                </CardTitle>
                <CardDescription>Configure API keys for AI providers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">OpenAI API Key</Label>
                    <Input
                      id="openai-key"
                      type="password"
                      value={openaiApiKey}
                      onChange={(e) => {
                        setOpenaiApiKey(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                    <Input
                      id="anthropic-key"
                      type="password"
                      value={anthropicApiKey}
                      onChange={(e) => {
                        setAnthropicApiKey(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="google-key">Google AI API Key</Label>
                    <Input
                      id="google-key"
                      type="password"
                      value={googleApiKey}
                      onChange={(e) => {
                        setGoogleApiKey(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E0E0E0] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="w-5 h-5" />
                  <span>API Limits</span>
                </CardTitle>
                <CardDescription>Configure API usage limits and rate limiting.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Max Tokens per Request</Label>
                    <Input
                      id="max-tokens"
                      type="number"
                      value={maxTokensPerRequest}
                      onChange={(e) => {
                        setMaxTokensPerRequest(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">Rate Limit per User</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="rate-limit"
                        type="number"
                        value={rateLimitPerUser}
                        onChange={(e) => {
                          setRateLimitPerUser(e.target.value)
                          setHasChanges(true)
                        }}
                        className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                      />
                      <select
                        value={rateLimitWindow}
                        onChange={(e) => {
                          setRateLimitWindow(e.target.value)
                          setHasChanges(true)
                        }}
                        className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                      >
                        <option value="minute">per minute</option>
                        <option value="hour">per hour</option>
                        <option value="day">per day</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card className="border-[#E0E0E0] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>SMTP Configuration</span>
                </CardTitle>
                <CardDescription>Configure email settings for notifications and communications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={smtpHost}
                      onChange={(e) => {
                        setSmtpHost(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      type="number"
                      value={smtpPort}
                      onChange={(e) => {
                        setSmtpPort(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">SMTP Username</Label>
                    <Input
                      id="smtp-username"
                      value={smtpUsername}
                      onChange={(e) => {
                        setSmtpUsername(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => {
                        setSmtpPassword(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="from-email">From Email</Label>
                    <Input
                      id="from-email"
                      type="email"
                      value={fromEmail}
                      onChange={(e) => {
                        setFromEmail(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-name">From Name</Label>
                    <Input
                      id="from-name"
                      value={fromName}
                      onChange={(e) => {
                        setFromName(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline">Test Email Configuration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Storage Settings */}
          <TabsContent value="storage" className="space-y-6">
            <Card className="border-[#E0E0E0] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>File Storage</span>
                </CardTitle>
                <CardDescription>Configure file storage and upload settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storage-provider">Storage Provider</Label>
                    <select
                      value={storageProvider}
                      onChange={(e) => {
                        setStorageProvider(e.target.value)
                        setHasChanges(true)
                      }}
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    >
                      <option value="local">Local Storage</option>
                      <option value="aws-s3">Amazon S3</option>
                      <option value="google-cloud">Google Cloud Storage</option>
                      <option value="azure">Azure Blob Storage</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                      <Input
                        id="max-file-size"
                        type="number"
                        value={maxFileSize}
                        onChange={(e) => {
                          setMaxFileSize(e.target.value)
                          setHasChanges(true)
                        }}
                        className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storage-quota">Storage Quota per User (MB)</Label>
                      <Input
                        id="storage-quota"
                        type="number"
                        value={storageQuotaPerUser}
                        onChange={(e) => {
                          setStorageQuotaPerUser(e.target.value)
                          setHasChanges(true)
                        }}
                        className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowed-types">Allowed File Types</Label>
                    <Input
                      id="allowed-types"
                      value={allowedFileTypes}
                      onChange={(e) => {
                        setAllowedFileTypes(e.target.value)
                        setHasChanges(true)
                      }}
                      placeholder="pdf,doc,docx,txt,csv,xlsx,ppt,pptx"
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                    <p className="text-sm text-gray-500">Comma-separated list of allowed file extensions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-[#E0E0E0] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Authentication & Security</span>
                </CardTitle>
                <CardDescription>Configure security policies and authentication settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Multi-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Force all users to enable MFA</p>
                    </div>
                    <Switch
                      checked={requireMFA}
                      onCheckedChange={(checked) => {
                        setRequireMFA(checked)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Audit Logging</Label>
                      <p className="text-sm text-gray-500">Log all user actions and system events</p>
                    </div>
                    <Switch
                      checked={enableAuditLog}
                      onCheckedChange={(checked) => {
                        setEnableAuditLog(checked)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Password Complexity</Label>
                      <p className="text-sm text-gray-500">Enforce strong password requirements</p>
                    </div>
                    <Switch
                      checked={requirePasswordComplexity}
                      onCheckedChange={(checked) => {
                        setRequirePasswordComplexity(checked)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => {
                        setSessionTimeout(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-length">Minimum Password Length</Label>
                    <Input
                      id="password-length"
                      type="number"
                      value={passwordMinLength}
                      onChange={(e) => {
                        setPasswordMinLength(e.target.value)
                        setHasChanges(true)
                      }}
                      className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowed-domains">Allowed Email Domains</Label>
                  <Input
                    id="allowed-domains"
                    value={allowedDomains}
                    onChange={(e) => {
                      setAllowedDomains(e.target.value)
                      setHasChanges(true)
                    }}
                    placeholder="company.com,partner.com (leave empty to allow all)"
                    className="border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                  />
                  <p className="text-sm text-gray-500">
                    Comma-separated list of allowed email domains for registration
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleResetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading} className="btn-primary">
            {isLoading ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
