// PDF Generation API Service
// This service handles PDF document generation from prompts and content

import { createSupabaseAdminClient } from '@/lib/supabase/client'
import OpenAI from 'openai'
import puppeteer from 'puppeteer'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export class PDFGenerationAPI {
  private supabase = createSupabaseAdminClient()

  // Generate a PDF document from a prompt
  async generatePDFFromPrompt(
    sessionId: string,
    userId: string,
    teamId: string,
    prompt: string,
    options?: {
      includeContext?: boolean
      includeImages?: boolean
      format?: 'A4' | 'Letter' | 'Legal'
      orientation?: 'portrait' | 'landscape'
      template?: 'report' | 'article' | 'memo' | 'presentation'
    }
  ) {
    try {
      const {
        includeContext = true,
        includeImages = false,
        format = 'A4',
        orientation = 'portrait',
        template = 'report'
      } = options || {}

      // Create PDF generation job
      const { data: job, error: jobError } = await this.supabase
        .from('pdf_generation_jobs')
        .insert({
          session_id: sessionId,
          user_id: userId,
          team_id: teamId,
          prompt: prompt,
          status: 'pending'
        })
        .select()
        .single()

      if (jobError) throw jobError

      try {
        // Update job status to processing
        await this.updateJobStatus(job.id, 'processing')

        // Generate content using AI
        const content = await this.generateContentFromPrompt(
          prompt,
          sessionId,
          includeContext
        )

        // Generate HTML from content
        const html = await this.generateHTML(content, template, {
          title: this.extractTitleFromPrompt(prompt),
          format,
          orientation
        })

        // Generate PDF from HTML
        const pdfBuffer = await this.generatePDFFromHTML(html, {
          format: format as any,
          landscape: orientation === 'landscape'
        })

        // Upload PDF to storage
        const fileName = `pdf-${job.id}-${Date.now()}.pdf`
        const fileUrl = await this.uploadPDFToStorage(pdfBuffer, fileName, teamId)

        // Update job with completion
        await this.supabase
          .from('pdf_generation_jobs')
          .update({
            content: content,
            file_url: fileUrl,
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id)

        return {
          success: true,
          jobId: job.id,
          fileUrl: fileUrl,
          content: content
        }
      } catch (error) {
        // Update job with error
        await this.updateJobStatus(job.id, 'failed', error instanceof Error ? error.message : 'Unknown error')
        throw error
      }
    } catch (error) {
      console.error('Error generating PDF from prompt:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Generate content from prompt using AI and context
  private async generateContentFromPrompt(
    prompt: string,
    sessionId: string,
    includeContext: boolean
  ): Promise<string> {
    try {
      let contextText = ''

      if (includeContext) {
        // Get relevant context from the session
        const { vectorAPI } = await import('./vector')
        const contextResponse = await vectorAPI.getChatContext(sessionId, prompt, 2000)
        
        if (contextResponse.success && contextResponse.context.length > 0) {
          contextText = '\n\nRelevant Context:\n' + 
            contextResponse.context
              .map((ctx: any) => `- ${ctx.content}`)
              .join('\n')
        }
      }

      // Create AI prompt for content generation
      const aiPrompt = `You are an expert technical writer. Generate comprehensive, well-structured content for a professional document based on the following request:

${prompt}${contextText}

Requirements:
- Create detailed, informative content suitable for a professional document
- Use proper headings, subheadings, and structure
- Include relevant technical details and explanations
- Write in a clear, professional tone
- Ensure the content is comprehensive and valuable
- Format using markdown for proper structure

Generate the complete document content:`

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical writer who creates comprehensive, well-structured professional documents.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })

      return response.choices[0]?.message?.content || 'Error: Could not generate content'
    } catch (error) {
      console.error('Error generating content from prompt:', error)
      throw new Error('Failed to generate document content')
    }
  }

  // Generate HTML from markdown content
  private async generateHTML(
    content: string,
    template: string,
    options: {
      title: string
      format: string
      orientation: string
    }
  ): Promise<string> {
    // Convert markdown to HTML (you might want to use a markdown parser like marked)
    const htmlContent = this.markdownToHTML(content)

    // Apply template styling
    const css = this.getTemplateCSS(template, options.format, options.orientation)

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${options.title}</title>
        <style>
            ${css}
        </style>
    </head>
    <body>
        <div class="document">
            <header class="document-header">
                <h1>${options.title}</h1>
                <div class="document-meta">
                    Generated on ${new Date().toLocaleDateString()}
                </div>
            </header>
            <main class="document-content">
                ${htmlContent}
            </main>
            <footer class="document-footer">
                <div class="page-number"></div>
            </footer>
        </div>
    </body>
    </html>
    `
  }

  // Simple markdown to HTML converter
  private markdownToHTML(markdown: string): string {
    return markdown
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hup])/gm, '<p>')
      .replace(/(?<!>)$/gm, '</p>')
      .replace(/<p><\/p>/g, '')
  }

  // Get CSS for different templates
  private getTemplateCSS(template: string, format: string, orientation: string): string {
    const baseCSS = `
      @page {
        size: ${format} ${orientation};
        margin: 1in;
      }
      
      body {
        font-family: 'Times New Roman', serif;
        line-height: 1.6;
        color: #333;
        font-size: 11pt;
      }
      
      .document {
        max-width: 100%;
      }
      
      .document-header {
        border-bottom: 2px solid #333;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      
      .document-header h1 {
        margin: 0;
        font-size: 24pt;
        font-weight: bold;
      }
      
      .document-meta {
        color: #666;
        font-size: 10pt;
        margin-top: 10px;
      }
      
      .document-content h1 {
        font-size: 18pt;
        margin-top: 30px;
        margin-bottom: 15px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 5px;
      }
      
      .document-content h2 {
        font-size: 14pt;
        margin-top: 25px;
        margin-bottom: 12px;
      }
      
      .document-content h3 {
        font-size: 12pt;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      
      .document-content p {
        margin-bottom: 12px;
        text-align: justify;
      }
      
      .document-content ul {
        margin-bottom: 12px;
      }
      
      .document-content li {
        margin-bottom: 6px;
      }
      
      .document-content code {
        background-color: #f5f5f5;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
      }
      
      .document-content pre {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 5px;
        border-left: 4px solid #007acc;
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        font-size: 10pt;
      }
      
      .document-footer {
        margin-top: 50px;
        padding-top: 20px;
        border-top: 1px solid #ccc;
        text-align: center;
        font-size: 10pt;
        color: #666;
      }
    `

    // Add template-specific styles
    switch (template) {
      case 'report':
        return baseCSS + `
          .document-header {
            text-align: center;
          }
          .document-content {
            text-align: justify;
          }
        `
      case 'article':
        return baseCSS + `
          .document-header h1 {
            font-size: 20pt;
          }
          .document-content {
            column-count: 1;
          }
        `
      case 'memo':
        return baseCSS + `
          .document-header {
            border-bottom: none;
            text-align: left;
          }
          .document-header h1 {
            font-size: 16pt;
          }
        `
      default:
        return baseCSS
    }
  }

  // Generate PDF from HTML using Puppeteer
  private async generatePDFFromHTML(
    html: string,
    options: {
      format: any
      landscape: boolean
    }
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })

      const pdfUint8Array = await page.pdf({
        format: options.format,
        landscape: options.landscape,
        printBackground: true,
        margin: {
          top: '1in',
          right: '1in',
          bottom: '1in',
          left: '1in'
        }
      })

      // Convert Uint8Array to Buffer
      return Buffer.from(pdfUint8Array)
    } finally {
      await browser.close()
    }
  }

  // Upload PDF to Supabase storage
  private async uploadPDFToStorage(
    pdfBuffer: Buffer,
    fileName: string,
    teamId: string
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from('generated-pdfs')
      .upload(`${teamId}/${fileName}`, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = this.supabase.storage
      .from('generated-pdfs')
      .getPublicUrl(data.path)

    return publicUrl
  }

  // Extract title from prompt
  private extractTitleFromPrompt(prompt: string): string {
    // Simple title extraction - you might want to use AI for better results
    const lines = prompt.split('\n')
    const firstLine = lines[0].trim()
    
    if (firstLine.length > 5 && firstLine.length < 100) {
      return firstLine
    }
    
    // Fallback to a truncated version of the prompt
    return prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt
  }

  // Update job status
  private async updateJobStatus(jobId: string, status: string, errorMessage?: string) {
    const updates: any = { status, updated_at: new Date().toISOString() }
    
    if (errorMessage) {
      updates.error_message = errorMessage
    }

    await this.supabase
      .from('pdf_generation_jobs')
      .update(updates)
      .eq('id', jobId)
  }

  // Get PDF generation job status
  async getJobStatus(jobId: string) {
    try {
      const { data, error } = await this.supabase
        .from('pdf_generation_jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (error) throw error

      return {
        success: true,
        job: data
      }
    } catch (error) {
      console.error('Error getting job status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get user's PDF generation jobs
  async getUserPDFJobs(userId: string, teamId: string, limit: number = 20) {
    try {
      const { data, error } = await this.supabase
        .from('pdf_generation_jobs')
        .select('*')
        .eq('user_id', userId)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return {
        success: true,
        jobs: data || []
      }
    } catch (error) {
      console.error('Error getting user PDF jobs:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        jobs: []
      }
    }
  }

  // Delete PDF job and file
  async deletePDFJob(jobId: string, userId: string) {
    try {
      // Get job details first
      const { data: job, error: getError } = await this.supabase
        .from('pdf_generation_jobs')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', userId)
        .single()

      if (getError) throw getError

      // Delete file from storage if it exists
      if (job.file_url) {
        const path = job.file_url.split('/').slice(-2).join('/')
        await this.supabase.storage
          .from('generated-pdfs')
          .remove([path])
      }

      // Delete job record
      const { error: deleteError } = await this.supabase
        .from('pdf_generation_jobs')
        .delete()
        .eq('id', jobId)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      return { success: true }
    } catch (error) {
      console.error('Error deleting PDF job:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export const pdfGenerationAPI = new PDFGenerationAPI()