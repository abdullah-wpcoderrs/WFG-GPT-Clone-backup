// Document Processing Utilities
// This utility handles different file types and extracts text content for vector processing

import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import xlsx from 'xlsx'
import { marked } from 'marked'

export interface ProcessedDocument {
  content: string
  metadata: {
    pageCount?: number
    wordCount: number
    charCount: number
    fileType: string
    extractedAt: string
    language?: string
    title?: string
    author?: string
  }
  sections?: {
    title: string
    content: string
    startIndex: number
    endIndex: number
  }[]
}

export class DocumentProcessor {
  // Main entry point for processing any document type
  async processDocument(file: File | Buffer, fileName: string, mimeType?: string): Promise<ProcessedDocument> {
    try {
      const fileType = this.getFileType(fileName, mimeType)
      let content: string
      let metadata: any = {
        fileType,
        extractedAt: new Date().toISOString()
      }

      switch (fileType) {
        case 'pdf':
          const pdfResult = await this.processPDF(file)
          content = pdfResult.content
          metadata = { ...metadata, ...pdfResult.metadata }
          break

        case 'docx':
          const docxResult = await this.processDocx(file)
          content = docxResult.content
          metadata = { ...metadata, ...docxResult.metadata }
          break

        case 'doc':
          throw new Error('Legacy .doc files are not supported. Please convert to .docx format.')

        case 'xlsx':
        case 'xls':
          const excelResult = await this.processExcel(file)
          content = excelResult.content
          metadata = { ...metadata, ...excelResult.metadata }
          break

        case 'csv':
          content = await this.processCSV(file)
          metadata.fileType = 'csv'
          break

        case 'txt':
        case 'md':
        case 'markdown':
          content = await this.processText(file)
          if (fileType === 'md' || fileType === 'markdown') {
            content = this.markdownToText(content)
          }
          break

        case 'html':
        case 'htm':
          content = await this.processHTML(file)
          break

        case 'json':
          content = await this.processJSON(file)
          break

        case 'xml':
          content = await this.processXML(file)
          break

        case 'rtf':
          throw new Error('RTF files are not yet supported. Please convert to .docx or .txt format.')

        case 'pptx':
          throw new Error('PowerPoint files are not yet supported. Please export as PDF or text.')

        default:
          throw new Error(`Unsupported file type: ${fileType}`)
      }

      // Calculate basic metadata
      metadata.wordCount = this.countWords(content)
      metadata.charCount = content.length
      metadata.language = this.detectLanguage(content)

      // Extract sections if possible
      const sections = this.extractSections(content, fileType)

      return {
        content: this.cleanText(content),
        metadata,
        sections
      }
    } catch (error) {
      console.error('Error processing document:', error)
      throw new Error(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Process PDF files
  private async processPDF(file: File | Buffer): Promise<{ content: string; metadata: any }> {
    try {
      const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file
      const pdfData = await pdfParse(buffer)

      return {
        content: pdfData.text,
        metadata: {
          pageCount: pdfData.numpages,
          title: pdfData.info?.Title,
          author: pdfData.info?.Author,
          creator: pdfData.info?.Creator,
          producer: pdfData.info?.Producer,
          creationDate: pdfData.info?.CreationDate,
          modificationDate: pdfData.info?.ModDate
        }
      }
    } catch (error) {
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Process DOCX files
  private async processDocx(file: File | Buffer): Promise<{ content: string; metadata: any }> {
    try {
      const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file
      const result = await mammoth.extractRawText({ buffer })

      return {
        content: result.value,
        metadata: {
          warnings: result.messages.filter(m => m.type === 'warning'),
          errors: result.messages.filter(m => m.type === 'error')
        }
      }
    } catch (error) {
      throw new Error(`Failed to process DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Process Excel files
  private async processExcel(file: File | Buffer): Promise<{ content: string; metadata: any }> {
    try {
      const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file
      const workbook = xlsx.read(buffer, { type: 'buffer' })
      
      let content = ''
      const sheets: Array<{ name: string; rowCount: number; range?: string }> = []

      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName]
        const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 })
        
        content += `\n\n=== Sheet: ${sheetName} ===\n`
        
        sheetData.forEach((row: any) => {
          if (Array.isArray(row) && row.length > 0) {
            content += row.filter(cell => cell !== null && cell !== undefined).join('\t') + '\n'
          }
        })

        sheets.push({
          name: sheetName,
          rowCount: sheetData.length,
          range: sheet['!ref']
        })
      })

      return {
        content: content.trim(),
        metadata: {
          sheetCount: workbook.SheetNames.length,
          sheets: sheets
        }
      }
    } catch (error) {
      throw new Error(`Failed to process Excel: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Process CSV files
  private async processCSV(file: File | Buffer): Promise<string> {
    try {
      const text = await this.processText(file)
      const lines = text.split('\n')
      
      // Convert CSV to readable text format
      let content = ''
      lines.forEach((line, index) => {
        if (line.trim()) {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
          if (index === 0) {
            content += `Headers: ${values.join(', ')}\n\n`
          } else {
            content += `Row ${index}: ${values.join(', ')}\n`
          }
        }
      })

      return content
    } catch (error) {
      throw new Error(`Failed to process CSV: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Process plain text files
  private async processText(file: File | Buffer): Promise<string> {
    try {
      if (file instanceof File) {
        return await file.text()
      } else {
        return file.toString('utf-8')
      }
    } catch (error) {
      throw new Error(`Failed to process text: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Process HTML files
  private async processHTML(file: File | Buffer): Promise<string> {
    try {
      const html = await this.processText(file)
      
      // Remove HTML tags and extract text content
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    } catch (error) {
      throw new Error(`Failed to process HTML: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Process JSON files
  private async processJSON(file: File | Buffer): Promise<string> {
    try {
      const jsonText = await this.processText(file)
      const jsonData = JSON.parse(jsonText)
      
      // Convert JSON to readable text
      return this.jsonToText(jsonData)
    } catch (error) {
      throw new Error(`Failed to process JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Process XML files
  private async processXML(file: File | Buffer): Promise<string> {
    try {
      const xml = await this.processText(file)
      
      // Simple XML to text conversion (remove tags)
      return xml
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    } catch (error) {
      throw new Error(`Failed to process XML: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Convert JSON to readable text
  private jsonToText(obj: any, level: number = 0): string {
    const indent = '  '.repeat(level)
    let text = ''

    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          text += `${indent}Item ${index + 1}:\n${this.jsonToText(item, level + 1)}\n`
        })
      } else {
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            text += `${indent}${key}:\n${this.jsonToText(value, level + 1)}\n`
          } else {
            text += `${indent}${key}: ${value}\n`
          }
        })
      }
    } else {
      text += `${indent}${obj}\n`
    }

    return text
  }

  // Convert markdown to plain text
  private markdownToText(markdown: string): string {
    // Remove markdown syntax
    return markdown
      .replace(/^#{1,6}\s+/gm, '') // Headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/`(.*?)`/g, '$1') // Inline code
      .replace(/```[\s\S]*?```/g, '') // Code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Images
      .replace(/^\s*[-*+]\s+/gm, '') // List items
      .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
      .replace(/^\s*>\s+/gm, '') // Blockquotes
      .replace(/\n{2,}/g, '\n\n') // Multiple newlines
      .trim()
  }

  // Extract sections from document content
  private extractSections(content: string, fileType: string): Array<{
    title: string
    content: string
    startIndex: number
    endIndex: number
  }> {
    const sections: Array<{
      title: string
      content: string
      startIndex: number
      endIndex: number
    }> = []
    
    // Look for common section patterns
    const sectionPatterns = [
      /^#{1,3}\s+(.+)$/gm, // Markdown headers
      /^([A-Z][A-Z\s]{2,})\s*$/gm, // ALL CAPS titles
      /^(\d+\.?\s+[A-Z].+)$/gm, // Numbered sections
      /^([A-Z][a-z\s]{5,}):?\s*$/gm // Title case sections
    ]

    sectionPatterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(content)) !== null) {
        const title = match[1].trim()
        const startIndex = match.index
        
        // Find the next section or end of document
        const nextMatch = pattern.exec(content)
        const endIndex = nextMatch ? nextMatch.index : content.length
        
        if (endIndex > startIndex + title.length + 10) { // Ensure section has content
          sections.push({
            title,
            content: content.substring(startIndex, endIndex).trim(),
            startIndex,
            endIndex
          })
        }
        
        // Reset regex lastIndex for next pattern
        if (!nextMatch) break
      }
      pattern.lastIndex = 0 // Reset for next pattern
    })

    // Sort sections by start index and remove overlaps
    return sections
      .sort((a, b) => a.startIndex - b.startIndex)
      .filter((section, index, arr) => {
        if (index === 0) return true
        const prevSection = arr[index - 1]
        return section.startIndex >= prevSection.endIndex
      })
  }

  // Determine file type from filename and mime type
  private getFileType(fileName: string, mimeType?: string): string {
    const extension = fileName.toLowerCase().split('.').pop() || ''
    
    const typeMap: { [key: string]: string } = {
      'pdf': 'pdf',
      'docx': 'docx',
      'doc': 'doc',
      'xlsx': 'xlsx',
      'xls': 'xls',
      'csv': 'csv',
      'txt': 'txt',
      'md': 'md',
      'markdown': 'markdown',
      'html': 'html',
      'htm': 'html',
      'json': 'json',
      'xml': 'xml',
      'rtf': 'rtf',
      'pptx': 'pptx',
      'ppt': 'pptx'
    }

    return typeMap[extension] || 'unknown'
  }

  // Clean and normalize text
  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n') // Handle old Mac line endings
      .replace(/\n{3,}/g, '\n\n') // Reduce excessive newlines
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/^\s+|\s+$/g, '') // Trim
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters except newlines
  }

  // Count words in text
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  // Simple language detection
  private detectLanguage(text: string): string {
    // Very basic language detection - you might want to use a proper library
    const sample = text.substring(0, 1000).toLowerCase()
    
    // Check for common English words
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    const englishCount = englishWords.reduce((count, word) => {
      return count + (sample.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length
    }, 0)

    // Simple heuristic: if we find many English words, assume English
    return englishCount > 5 ? 'en' : 'unknown'
  }

  // Get supported file types
  getSupportedFileTypes(): string[] {
    return ['pdf', 'docx', 'xlsx', 'xls', 'csv', 'txt', 'md', 'markdown', 'html', 'htm', 'json', 'xml']
  }

  // Check if file type is supported
  isFileTypeSupported(fileName: string, mimeType?: string): boolean {
    const fileType = this.getFileType(fileName, mimeType)
    return this.getSupportedFileTypes().includes(fileType)
  }
}

export const documentProcessor = new DocumentProcessor()