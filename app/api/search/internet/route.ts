// API Route: Internet Search
// POST /api/search/internet

import { NextRequest, NextResponse } from 'next/server'
import { internetSearchAPI } from '@/lib/supabase/api/internet-search'
import { createSupabaseServerClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { query, provider, maxResults, useCache, summarize } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
        { status: 400 }
      )
    }

    let result

    if (summarize) {
      // Use search and summarize functionality
      result = await internetSearchAPI.searchAndSummarize(query, {
        provider: provider || 'google',
        maxResults: maxResults || 5,
        summaryLength: 'medium'
      })
    } else {
      // Use regular search
      result = await internetSearchAPI.searchInternet(query, {
        provider: provider || 'google',
        maxResults: maxResults || 10,
        useCache: useCache !== false
      })
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      query,
      provider: provider || 'google',
      ...result
    })

  } catch (error) {
    console.error('Error performing internet search:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}