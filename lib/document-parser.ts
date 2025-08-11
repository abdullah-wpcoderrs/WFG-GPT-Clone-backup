/**
 * Document Parser Utility
 * Handles parsing of uploaded documents for context extraction
 */

// Mock function to extract text from a file
// In a real implementation, you would use libraries like pdfjs for PDFs,
// mammoth for DOCX files, etc.
export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result
        if (typeof content === 'string') {
          // For text files, return content directly
          if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            resolve(content)
          }
          // For other file types, we would use specific parsers
          // This is a mock implementation that just returns the content
          resolve(content)
        } else {
          // Handle ArrayBuffer content
          resolve('Binary file content (mock implementation)')
        }
      } catch (error) {
        reject(new Error(`Failed to parse file: ${error}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    // Read as text for simplicity in this mock implementation
    reader.readAsText(file)
  })
}

// Mock function to extract key points from text
export function extractKeyPoints(text: string): string[] {
  // Simple keyword extraction (in a real implementation, you might use NLP libraries)
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'])
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .slice(0, 10) // Limit to top 10 keywords
}

// Mock function to generate a summary from text
export function generateSummary(text: string): string {
  // Simple summary generation (in a real implementation, you might use AI summarization)
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    
  if (sentences.length === 0) return 'No content to summarize.'
  
  // Return first and last sentences as a simple summary
  if (sentences.length === 1) return sentences[0]
  
  return `${sentences[0]} ... ${sentences[sentences.length - 1]}`
}

// Document context interface
export interface DocumentContext {
  id: string
  fileName: string
  content: string
  summary: string
  keyPoints: string[]
  uploadedAt: string
}

// Mock function to create document context
export async function createDocumentContext(file: File): Promise<DocumentContext> {
  const content = await extractTextFromFile(file)
  const keyPoints = extractKeyPoints(content)
  const summary = generateSummary(content)
  
  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fileName: file.name,
    content,
    summary,
    keyPoints,
    uploadedAt: new Date().toISOString()
  }
}
