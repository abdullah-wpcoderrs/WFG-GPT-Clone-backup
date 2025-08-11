import { NextResponse } from "next/server"
import { mockGptsData } from "@/lib/mock-gpts"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const gpt = mockGptsData.find((g) => g.id === id)

  if (gpt) {
    return NextResponse.json(gpt)
  } else {
    return new NextResponse("GPT not found", { status: 404 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const index = mockGptsData.findIndex((g) => g.id === id)

  if (index !== -1) {
    mockGptsData.splice(index, 1)
    return new NextResponse(null, { status: 204 }) // No Content
  } else {
    return new NextResponse("GPT not found", { status: 404 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const updatedGpt = await request.json()
  const index = mockGptsData.findIndex((g) => g.id === id)

  if (index !== -1) {
    mockGptsData[index] = { ...mockGptsData[index], ...updatedGpt, updated_at: new Date().toISOString() }
    return NextResponse.json(mockGptsData[index])
  } else {
    return new NextResponse("GPT not found", { status: 404 })
  }
}
