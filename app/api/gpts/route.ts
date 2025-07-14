import { NextResponse } from "next/server"
import { mockGPTs } from "@/lib/mock-data"
import type { GPT } from "@/types"

// Keep data in-memory so it survives during the preview session.
// Clone to avoid mutating the original mock array.
const gpts: GPT[] = structuredClone(mockGPTs)

/**
 * GET /api/gpts
 * Returns the list of GPTs as JSON.
 */
export async function GET() {
  return NextResponse.json(gpts, { status: 200 })
}

/**
 * POST /api/gpts
 * Creates a new GPT (very simplified - just echoes the body back with an id).
 */
export async function POST(request: Request) {
  const body = (await request.json()) as Partial<GPT>

  const newGPT: GPT = {
    id: `gpt-${Date.now()}`,
    name: body.name ?? "Untitled GPT",
    description: body.description ?? "",
    team_name: body.team_name ?? "Unknown Team",
    last_used: "",
    usage_count: 0,
    status: "active",
    created_by: body.created_by ?? "system",
    web_access: body.web_access ?? false,
    approval_status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    active_users: 0,
    model: body.model ?? "GPT-3.5",
    monthly_cost: 0,
    compliance_score: 0,
    risk_level: "low",
    access_level: "team",
  }

  gpts.unshift(newGPT)
  return NextResponse.json(newGPT, { status: 201 })
}
