// Utility function to detect document generation requests in user messages

// More specific keywords and phrases that clearly indicate a document request
const DOCUMENT_REQUEST_INDICATORS = [
  'generate a', 'create a', 'make a', 'produce a', 'write a', 'draft a', 'compose a',
  'generate the', 'create the', 'make the', 'produce the', 'write the', 'draft the', 'compose the',
  'can you generate', 'can you create', 'can you make', 'can you write',
  'could you generate', 'could you create', 'could you make', 'could you write',
  'please generate', 'please create', 'please make', 'please write',
  'i need a report', 'i want a report', 'i need a document', 'i want a document',
  'create report', 'generate report', 'write report'
]

// Document types that users might request
const DOCUMENT_TYPES = [
  'report', 'summary', 'analysis', 'plan', 'proposal', 'presentation',
  'document', 'pdf', 'doc', 'docx', 'slide deck', 'brief', 'overview',
  'strategy', 'framework', 'guide', 'manual', 'policy', 'procedure'
]

/**
 * Detects if a user message is requesting document generation
 * @param message The user's message
 * @returns boolean indicating if this is a document request
 */
export function isDocumentRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase().trim()
  
  // Check for specific document request patterns
  const hasRequestIndicator = DOCUMENT_REQUEST_INDICATORS.some(indicator => 
    lowerMessage.includes(indicator)
  )
  
  const hasDocumentType = DOCUMENT_TYPES.some(type => 
    lowerMessage.includes(type)
  )
  
  // More specific heuristic: must have a clear request indicator AND document type
  return hasRequestIndicator && hasDocumentType
}

/**
 * Extracts document request details from a user message
 * @param message The user's message
 * @returns Object with extracted document request details
 */
export function extractDocumentRequestDetails(message: string): {
  title: string
  type: string | null
  context: string | null
} {
  const lowerMessage = message.toLowerCase()
  
  // Extract document type
  const foundType = DOCUMENT_TYPES.find(type => lowerMessage.includes(type)) || null
  
  // Generate a title based on the message
  let title = "Document Request"
  if (foundType) {
    title = `${foundType.charAt(0).toUpperCase() + foundType.slice(1)}`
  }
  
  return {
    title,
    type: foundType,
    context: null
  }
}

/**
 * Suggests document generation based on user message
 * @param message The user's message
 * @returns Suggested response if this is a document request
 */
export function suggestDocumentGeneration(message: string): string | null {
  // Only suggest for clear document requests
  if (isDocumentRequest(message)) {
    return "Would you like me to generate a document for this request?"
  }
  return null
}
