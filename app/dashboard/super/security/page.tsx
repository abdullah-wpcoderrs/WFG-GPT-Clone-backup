"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Search,
  Download,
  RefreshCw,
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
    description: "Organization GPT management",
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
    description: "Team structure & assignments",
  },
  {
    name: "Document Library",
    href: "/dashboard/super/documents",
    icon: FileText,
    description: "Global document management",
  },
  {
    name: "Prompt Library",
    href: "/dashboard/super/prompts",
    icon: BookOpen,
    description: "Organization prompt templates",
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

const mockSecurityEvents = [
  {
    id: "event-1",
    type: "login_success",
    user: "Sarah Johnson",
    user_id: "admin-1",
    description: "Successful login",
    ip_address: "192.168.1.100",
    location: "New York, NY",
    device: "Chrome on Windows",
    timestamp: "2024-01-15T14:30:00Z",
    risk_level: "low",
  },
  {
    id: "event-2",
    type: "login_failed",
    user: "Unknown",
    user_id: null,
    description: "Failed login attempt for admin@company.com",
    ip_address: "203.0.113.45",
    location: "Unknown",
    device: "Firefox on Linux",
    timestamp: "2024-01-15T14:25:00Z",
    risk_level: "high",
  },
  {
    id: "event-3",
    type: "password_change",
    user: "Michael Chen",
    user_id: "admin-2",
    description: "Password changed successfully",
    ip_address: "192.168.1.105",
    location: "San Francisco, CA",
    device: "Safari on macOS",
    timestamp: "2024-01-15T13:45:00Z",
    risk_level: "low",
  },
  {
    id: "event-4",
    type: "permission_change",
    user: "Emily Rodriguez",
    user_id: "admin-3",
    description: "User permissions modified for john.doe@company.com",
    ip_address: "192.168.1.110",
    location: "Chicago, IL",
    device: "Chrome on Windows",
    timestamp: "2024-01-15T12:20:00Z",
    risk_level: "medium",
  },
  {
    id: "event-5",
    type: "data_export",
    user: "Lisa Thompson",
    user_id: "admin-5",
    description: "Exported user data report",
    ip_address: "192.168.1.115",
    location: "Austin, TX",
    device: "Edge on Windows",
    timestamp: "2024-01-15T11:30:00Z",
    risk_level: "medium",
  },
]

const mockActiveSessions = [
  {
    id: "session-1",
    user: "Sarah Johnson",
    user_id: "admin-1",
    ip_address: "192.168.1.100",
    location: "New York, NY",
    device: "Chrome on Windows",
    started_at: "2024-01-15T09:00:00Z",
    last_activity: "2024-01-15T14:30:00Z",
    is_current: true,
  },
  {
    id: "session-2",
    user: "Michael Chen",
    user_id: "admin-2",
    ip_address: "192.168.1.105",
    location: "San Francisco, CA",
    device: "Safari on macOS",
    started_at: "2024-01-15T08:30:00Z",
    last_activity: "2024-01-15T14:15:00Z",
    is_current: false,
  },
  {
    id: "session-3",
    user: "Emily Rodriguez",
    user_id: "admin-3",
    ip_address: "10.0.0.50",
    location: "Chicago, IL",
    device: "Chrome on Windows",
    started_at: "2024-01-15T10:15:00Z",
    last_activity: "2024-01-15T14:00:00Z",
    is_current: false,
  },
]

const mockSecurityPolicies = [
  {
    id: "policy-1",
    name: "Password Policy",
    description: "Minimum 8 characters, complexity required",
    status: "active",
    last_updated: "2024-01-10T10:00:00Z",
    compliance: 95,
  },
  {
    id: "policy-2",
    name: "Multi-Factor Authentication",
    description: "MFA required for all admin users",
    status: "active",
    last_updated: "2024-01-08T14:20:00Z",
    compliance: 87,
  },
  {
    id: "policy-3",
    name: "Session Timeout",
    description: "Automatic logout after 24 hours of inactivity",
    status: "active",
    last_updated: "2024-01-05T09:15:00Z",
    compliance: 100,
  },
  {
    id: "policy-4",
    name: "IP Whitelist",
    description: "Restrict access to approved IP ranges",
    status: "inactive",
    last_updated: "2024-01-01T08:00:00Z",
    compliance: 0,
  },
]

export default function SuperSecurityPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterRisk, setFilterRisk] = useState("all")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])

  const filteredEvents = mockSecurityEvents.filter((event) => {
    const matchesSearch =
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.ip_address.includes(searchQuery)
    const matchesType = filterType === "all" || event.type === filterType
    const matchesRisk = filterRisk === "all" || event.risk_level === filterRisk
    return matchesSearch && matchesType && matchesRisk
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      default:
        return <Badge>{risk}</Badge>
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login_success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "login_failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "password_change":
        return <Lock className="w-4 h-4 text-blue-500" />
      case "permission_change":
        return <Shield className="w-4 h-4 text-orange-500" />
      case "data_export":
        return <Download className="w-4 h-4 text-purple-500" />
      default:
        return <Eye className="w-4 h-4 text-gray-500" />
    }
  }

  const getDeviceIcon = (device: string) => {
    if (
      device.toLowerCase().includes("mobile") ||
      device.toLowerCase().includes("android") ||
      device.toLowerCase().includes("ios")
    ) {
      return <Smartphone className="w-4 h-4 text-gray-500" />
    }
    return <Monitor className="w-4 h-4 text-gray-500" />
  }

  const handleTerminateSession = (sessionId: string) => {
    console.log("Terminating session:", sessionId)
  }

  const handleExportLogs = () => {
    console.log("Exporting security logs")
  }

  const totalEvents = mockSecurityEvents.length
  const highRiskEvents = mockSecurityEvents.filter((event) => event.risk_level === "high").length
  const failedLogins = mockSecurityEvents.filter((event) => event.type === "login_failed").length
  const activeSessions = mockActiveSessions.length
  const avgCompliance =
    mockSecurityPolicies.reduce((sum, policy) => sum + policy.compliance, 0) / mockSecurityPolicies.length

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Security Center"
      description="Monitor security events, manage access controls, and enforce policies."
    >
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-[#66BB6A]" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{totalEvents}</p>
                <p className="text-sm text-gray-600">Security Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{highRiskEvents}</p>
                <p className="text-sm text-gray-600">High Risk Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Lock className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{failedLogins}</p>
                <p className="text-sm text-gray-600">Failed Logins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{activeSessions}</p>
                <p className="text-sm text-gray-600">Active Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-[#2C2C2C]">{avgCompliance.toFixed(0)}%</p>
                <p className="text-sm text-gray-600">Policy Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {highRiskEvents > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Security Alert:</strong> {highRiskEvents} high-risk event{highRiskEvents !== 1 ? "s" : ""} detected
            in the last 24 hours. Review the security log for details.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Security Events */}
        <TabsContent value="events" className="space-y-6">
          <Card className="border-[#E0E0E0] shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-[#2C2C2C]">Security Event Log</CardTitle>
              <CardDescription>Monitor and analyze security events across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search events by user, description, or IP address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                  >
                    <option value="all">All Events</option>
                    <option value="login_success">Login Success</option>
                    <option value="login_failed">Login Failed</option>
                    <option value="password_change">Password Change</option>
                    <option value="permission_change">Permission Change</option>
                    <option value="data_export">Data Export</option>
                  </select>
                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value)}
                    className="px-3 py-2 border border-[#E0E0E0] rounded-md text-sm focus:border-[#66BB6A] focus:ring-[#66BB6A]"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                  </select>
                  <Button onClick={handleExportLogs} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Location & Device</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getEventIcon(event.type)}
                          <div>
                            <p className="font-medium text-[#2C2C2C]">{event.description}</p>
                            <p className="text-sm text-gray-500">IP: {event.ip_address}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#2C2C2C]">{event.user}</p>
                          {event.user_id && <p className="text-sm text-gray-500">{event.user_id}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                            {getDeviceIcon(event.device)}
                            <span>{event.device}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRiskBadge(event.risk_level)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(event.timestamp)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No security events found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Sessions */}
        <TabsContent value="sessions" className="space-y-6">
          <Card className="border-[#E0E0E0] shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-[#2C2C2C]">Active User Sessions</CardTitle>
              <CardDescription>Monitor and manage active user sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Location & Device</TableHead>
                    <TableHead>Session Duration</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockActiveSessions.map((session) => (
                    <TableRow key={session.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#B9E769] rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-[#2C2C2C]">
                              {session.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[#2C2C2C]">{session.user}</p>
                            <p className="text-sm text-gray-500">IP: {session.ip_address}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                            {getDeviceIcon(session.device)}
                            <span>{session.device}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {Math.floor(
                            (new Date().getTime() - new Date(session.started_at).getTime()) / (1000 * 60 * 60),
                          )}
                          h{" "}
                          {Math.floor(
                            ((new Date().getTime() - new Date(session.started_at).getTime()) % (1000 * 60 * 60)) /
                              (1000 * 60),
                          )}
                          m
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(session.last_activity)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {session.is_current && <Badge className="bg-green-100 text-green-800 text-xs">Current</Badge>}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTerminateSession(session.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Terminate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Policies */}
        <TabsContent value="policies" className="space-y-6">
          <Card className="border-[#E0E0E0] shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-[#2C2C2C]">Security Policies</CardTitle>
              <CardDescription>Manage and monitor security policy compliance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSecurityPolicies.map((policy) => (
                    <TableRow key={policy.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#2C2C2C]">{policy.name}</p>
                          <p className="text-sm text-gray-500">{policy.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {policy.status === "active" ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            <Lock className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                policy.compliance >= 90
                                  ? "bg-green-500"
                                  : policy.compliance >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${policy.compliance}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{policy.compliance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(policy.last_updated)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            {policy.status === "active" ? "Disable" : "Enable"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-[#E0E0E0] shadow-none">
              <CardHeader>
                <CardTitle className="text-lg text-[#2C2C2C]">Security Reports</CardTitle>
                <CardDescription>Generate comprehensive security reports.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full btn-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Security Audit Report
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Failed Login Report
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  User Activity Report
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Policy Compliance Report
                </Button>
              </CardContent>
            </Card>

            <Card className="border-[#E0E0E0] shadow-none">
              <CardHeader>
                <CardTitle className="text-lg text-[#2C2C2C]">Security Metrics</CardTitle>
                <CardDescription>Key security indicators and trends.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Login Success Rate</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "94.2%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>MFA Adoption</span>
                    <span className="font-medium">87.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "87.3%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Password Compliance</span>
                    <span className="font-medium">95.1%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "95.1%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Session Security</span>
                    <span className="font-medium">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
