import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/client'
import { gptsAPI } from '@/lib/supabase/api/gpts'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await gptsAPI.getGPT(params.id)

    if (error) {
      return NextResponse.json({ error }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching GPT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Remove fields that shouldn't be updated via API
    const { id: _, creator_id: __, team_id: ___, created_at: ____, ...updates } = body

    const { data, error } = await gptsAPI.updateGPT(params.id, updates)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating GPT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await gptsAPI.deleteGPT(params.id)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ message: 'GPT deleted successfully' })
  } catch (error) {
    console.error('Error deleting GPT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}