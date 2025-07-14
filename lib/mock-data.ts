import type { User, Team, GPT } from "@/types"

export const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Strategic Support Team",
    members: [],
  },
  {
    id: "team-2",
    name: "Finance Team",
    members: [],
  },
  {
    id: "team-3",
    name: "Learning and Development",
    members: [],
  },
  {
    id: "team-4",
    name: "Resourcing and Outsourcing Units",
    members: [],
  },
  {
    id: "team-5",
    name: "Revenue Growth Unit",
    members: [],
  },
  {
    id: "team-6",
    name: "Business Development Unit",
    members: [],
  },
  {
    id: "team-7",
    name: "Executive Management",
    members: [],
  },
]

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "user@test.com",
    full_name: "John Smith",
    role: "user",
    team_id: "team-1",
    team_name: "Strategic Support Team",
  },
  {
    id: "admin-1",
    email: "admin@test.com",
    full_name: "Sarah Johnson",
    role: "admin",
    team_id: "team-2",
    team_name: "Finance Team",
  },
  {
    id: "superadmin-1",
    email: "superadmin@test.com",
    full_name: "Michael Chen",
    role: "super_admin",
    team_id: "team-7",
    team_name: "Executive Management",
  },
]

export const mockGPTs: GPT[] = [
  {
    id: "gpt-1",
    name: "LegalGPT",
    description: "Helps answer legal queries and draft legal documents",
    team_name: "Strategic Support Team",
    last_used: "2024-01-15",
    usage_count: 45,
    status: "active",
    created_by: "admin-1",
    web_access: true,
  },
  {
    id: "gpt-2",
    name: "FinanceBot",
    description: "Assists with financial analysis and reporting",
    team_name: "Finance Team",
    last_used: "2024-01-14",
    usage_count: 32,
    status: "active",
    created_by: "admin-1",
    web_access: false,
  },
  {
    id: "gpt-3",
    name: "ReportWriter",
    description: "Generates comprehensive business reports",
    team_name: "Organization-wide",
    last_used: "2024-01-13",
    usage_count: 78,
    status: "active",
    created_by: "superadmin-1",
    web_access: true,
  },
]
