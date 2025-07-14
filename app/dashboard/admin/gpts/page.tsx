"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  MessageSquare,
  Brain,
  Users,
  BarChart3,
  Settings,
  FileText,
  BookOpen,
  Plus,
  Search,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import type { GPT } from "@/types"

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
]

export default function AdminGPTsPage() {
  const [gpts, setGpts] = useState<GPT[]>([])
  const [search, setSearch] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchGpts = async () => {
      try {
        const response = await fetch("/api/gpts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setGpts(data)
      } catch (error: any) {
        console.error("Failed to fetch GPTs:", error)
        toast({
          title: "Error fetching GPTs",
          description: error.message || "Failed to fetch GPTs",
          variant: "destructive",
        })
      }
    }

    fetchGpts()
  }, [toast])

  const filteredGPTs = gpts.filter((gpt) => gpt.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      title="Team GPTs"
      description="Manage your team's AI assistants."
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-[#2C2C2C]">Team GPTs</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search GPTs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full border-[#E0E0E0] focus:border-[#66BB6A] focus:ring-[#66BB6A]"
            />
          </div>
          <Button
            onClick={() => router.push("/dashboard/admin/gpts/new")}
            className="btn-primary w-full sm:w-auto shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New GPT
          </Button>
        </div>
      </div>
      <Table>
        <TableCaption>A list of your team's custom GPTs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGPTs.length > 0 ? (
            filteredGPTs.map((gpt) => (
              <TableRow key={gpt.id}>
                <TableCell className="font-medium">{gpt.id}</TableCell>
                <TableCell>{gpt.name}</TableCell>
                <TableCell>{gpt.description}</TableCell>
                <TableCell>{gpt.team_name}</TableCell>
                <TableCell>{new Date(gpt.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/admin/chats/${gpt.id}`}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Open Chat
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          // Assuming an edit page exists, e.g., /dashboard/admin/gpts/edit/[id]
                          router.push(`/dashboard/admin/gpts/edit/${gpt.id}`)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/gpts/${gpt.id}`, {
                              method: "DELETE",
                            })

                            if (!response.ok) {
                              throw new Error(`HTTP error! status: ${response.status}`)
                            }

                            setGpts((prevGpts) => prevGpts.filter((g) => g.id !== gpt.id))

                            toast({
                              title: "GPT deleted",
                              description: `${gpt.name} has been deleted.`,
                            })
                          } catch (error: any) {
                            console.error("Failed to delete GPT:", error)
                            toast({
                              title: "Error deleting GPT",
                              description: error.message || "Failed to delete GPT",
                              variant: "destructive",
                            })
                          }
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No GPTs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DashboardLayout>
  )
}
