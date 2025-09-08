// API Route: GPT Context Management
// POST /api/gpt/context - Add document to GPT context
// DELETE /api/gpt/context - Remove document from GPT context
// GET /api/gpt/context/[gptId] - Get GPT context documents

import { NextRequest, NextResponse } from 'next/server'
import { vectorAPI } from '@/lib/supabase/api/vector'
import { createSupabaseServerClient } from '@/lib/supabase/client'

// Add document to GPT context
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
    const { gptId, documentId, priority } = body

    if (!gptId || !documentId) {
      return NextResponse.json(
        { error: 'Missing required fields: gptId, documentId' },
        { status: 400 }
      )
    }

    // Verify user has access to the GPT
    const { data: gpt, error: gptError } = await supabase
      .from('gpts')
      .select('team_id')
      .eq('id', gptId)
      .single()

    if (gptError || !gpt) {
      return NextResponse.json({ error: 'GPT not found' }, { status: 404 })
    }

    // Verify user has access to the document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('team_id')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Verify both are in the same team (or user is super admin)
    const { data: profile } = await supabase
      .from('users')
      .select('team_id, role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'super_admin' && 
        (profile?.team_id !== gpt.team_id || profile?.team_id !== document.team_id)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Add document to GPT context
    const result = await vectorAPI.addDocumentToGptContext(
      gptId,
      documentId,
      user.id,
      priority || 0
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      contextId: result.contextId
    })

  } catch (error) {
    console.error('Error adding document to GPT context:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Remove document from GPT context
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { gptId, documentId } = body

    if (!gptId || !documentId) {
      return NextResponse.json(
        { error: 'Missing required fields: gptId, documentId' },
        { status: 400 }
      )
    }

    // Verify user has access to the GPT
    const { data: gpt, error: gptError } = await supabase
      .from('gpts')
      .select('team_id')
      .eq('id', gptId)
      .single()

    if (gptError || !gpt) {
      return NextResponse.json({ error: 'GPT not found' }, { status: 404 })
    }

    // Check permissions
    const { data: profile } = await supabase
      .from('users')
      .select('team_id, role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'super_admin' && profile?.team_id !== gpt.team_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Remove document from GPT context
    const result = await vectorAPI.removeDocumentFromGptContext(gptId, documentId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      removed: result.removed
    })

  } catch (error) {
    console.error('Error removing document from GPT context:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}