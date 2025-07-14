import { NextResponse } from "next/server"
import { mockGPTs } from "@/lib/mock-data"
import type { GPT } from "@/types"

const gpts: GPT[] = structuredClone(mockGPTs)

interface Params {
  params: { id: string }
}

/**
 * GET /api/gpts/:id
 */
export async function GET(_req: Request, { params }: Params) {
  const gpt = gpts.find((g) => g.id === params.id)
  if (!gpt) {
    return NextResponse.json({ message: "GPT not found" }, { status: 404 })
  }
  return NextResponse.json(gpt, { status: 200 })
}

/**
 * DELETE /api/gpts/:id
 */
export async function DELETE(_req: Request, { params }: Params) {
  const index = gpts.findIndex((g) => g.id === params.id)
  if (index === -1) {
    return NextResponse.json({ message: "GPT not found" }, { status: 404 })
  }
  const [deleted] = gpts.splice(index, 1)
  return NextResponse.json(deleted, { status: 200 })
}
