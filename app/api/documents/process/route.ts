// API Route: Process Document for Vector Search
// POST /api/documents/process

import { NextRequest, NextResponse } from 'next/server'
import { vectorAPI } from '@/lib/supabase/api/vector'
import { documentProcessor } from '@/lib/document-processor'
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
    const { documentId, fileName, fileUrl, options } = body

    if (!documentId || !fileName || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: documentId, fileName, fileUrl' },
        { status: 400 }
      )
    }

    // Check if user has access to the document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Download the file content
    const fileResponse = await fetch(fileUrl)
    if (!fileResponse.ok) {
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
    }

    const fileBuffer = await fileResponse.arrayBuffer()

    // Process the document to extract text content
    const fileType = document.file_type ? document.file_type : undefined
    const processedDoc = await documentProcessor.processDocument(
      Buffer.from(fileBuffer),
      fileName,
      fileType
    )

    // Process the document for vector search
    const result = await vectorAPI.processDocument(
      documentId,
      processedDoc.content,
      {
        chunkSize: options?.chunkSize || 1000,
        overlap: options?.overlap || 200,
        generateEmbeddings: options?.generateEmbeddings !== false
      }
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Get existing metadata safely
    const existingMetadata = document.metadata && typeof document.metadata === 'object' 
      ? (document.metadata as Record<string, any>) 
      : {}

    // Update document metadata
    await supabase
      .from('documents')
      .update({
        metadata: {
          ...existingMetadata,
          processed: true,
          processedAt: new Date().toISOString(),
          wordCount: processedDoc.metadata.wordCount,
          charCount: processedDoc.metadata.charCount,
          chunkCount: result.chunkCount
        }
      })
      .eq('id', documentId)

    return NextResponse.json({
      success: true,
      documentId,
      chunkCount: result.chunkCount,
      metadata: processedDoc.metadata
    })

  } catch (error) {
    console.error('Error processing document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}