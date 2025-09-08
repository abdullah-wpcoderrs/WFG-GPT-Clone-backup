// API Route: Vector Search
// POST /api/search/vector

import { NextRequest, NextResponse } from 'next/server'
import { vectorAPI } from '@/lib/supabase/api/vector'
import { createSupabaseServerClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile for team information
    const { data: profile } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user.id)
      .single()

    const teamId = profile?.team_id ?? undefined

    // Parse the request body
    const body = await request.json()
    const { query, gptId, limit, threshold } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
        { status: 400 }
      )
    }

    // Perform vector search
    const result = await vectorAPI.searchSimilarDocuments(query, {
      gptId,
      teamId,
      limit: limit || 10,
      threshold: threshold || 0.7
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      query,
      results: result.results
    })

  } catch (error) {
    console.error('Error performing vector search:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}