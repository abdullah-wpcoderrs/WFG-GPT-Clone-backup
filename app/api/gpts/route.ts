import { NextResponse } from "next/server"
import { mockGptsData } from "@/lib/mock-gpts"

/**
 * GET /api/gpts
 * Returns the list of GPTs as JSON.
 */
export async function GET() {
  return NextResponse.json(mockGptsData)
}

/**
 * POST /api/gpts
 * Creates a new GPT (very simplified - just echoes the body back with an id).
 */
export async function POST(request: Request) {
  const newGpt = await request.json()
  // In a real application, you would save this to a database
  // For now, we'll just add it to our mock data (though it won't persist across server restarts)
  mockGptsData.push({ ...newGpt, id: `gpt-${mockGptsData.length + 1}`, created_at: new Date().toISOString() })
  return NextResponse.json(newGpt, { status: 201 })
}
