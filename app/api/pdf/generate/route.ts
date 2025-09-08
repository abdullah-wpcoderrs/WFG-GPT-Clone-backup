// API Route: PDF Generation
// POST /api/pdf/generate

import { NextRequest, NextResponse } from 'next/server'
import { pdfGenerationAPI } from '@/lib/supabase/api/pdf-generation'
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

    const teamId = profile?.team_id

    if (!teamId) {
      return NextResponse.json({ error: 'User team not found' }, { status: 400 })
    }

    // Parse the request body
    const body = await request.json()
    const { sessionId, prompt, options } = body

    if (!sessionId || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, prompt' },
        { status: 400 }
      )
    }

    // Verify session access
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found or access denied' }, { status: 404 })
    }

    // Generate PDF
    const result = await pdfGenerationAPI.generatePDFFromPrompt(
      sessionId,
      user.id,
      teamId,
      prompt,
      options
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      jobId: result.jobId,
      fileUrl: result.fileUrl
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/pdf/generate - Get user's PDF jobs
export async function GET(request: NextRequest) {
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

    const teamId = profile?.team_id

    if (!teamId) {
      return NextResponse.json({ error: 'User team not found' }, { status: 400 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get user's PDF jobs
    const result = await pdfGenerationAPI.getUserPDFJobs(user.id, teamId, limit)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      jobs: result.jobs
    })

  } catch (error) {
    console.error('Error getting PDF jobs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}