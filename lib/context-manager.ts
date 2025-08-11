/**
 * Context Manager Utility
 * Handles document context storage and injection for chat sessions
 */

import type { DocumentContext } from './document-parser'

// Context storage interface
export interface SessionContext {
  sessionId: string
  documentContexts: DocumentContext[]
  createdAt: string
  updatedAt: string
}

// In-memory context storage (would be replaced with database in real implementation)
const sessionContexts: Record<string, SessionContext> = {}

/**
 * Save document contexts for a session
 * @param sessionId The session ID
 * @param contexts The document contexts to save
 */
export function saveSessionContext(sessionId: string, contexts: DocumentContext[]): void {
  sessionContexts[sessionId] = {
    sessionId,
    documentContexts: contexts,
    createdAt: sessionContexts[sessionId]?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

/**
 * Get document contexts for a session
 * @param sessionId The session ID
 * @returns The document contexts for the session
 */
export function getSessionContext(sessionId: string): DocumentContext[] {
  return sessionContexts[sessionId]?.documentContexts || []
}

/**
 * Clear document contexts for a session
 * @param sessionId The session ID
 */
export function clearSessionContext(sessionId: string): void {
  if (sessionContexts[sessionId]) {
    sessionContexts[sessionId].documentContexts = []
    sessionContexts[sessionId].updatedAt = new Date().toISOString()
  }
}

/**
 * Generate context summary for injection into chat prompts
 * @param sessionId The session ID
 * @returns A formatted context summary
 */
export function generateContextSummary(sessionId: string): string {
  const contexts = getSessionContext(sessionId)
  
  if (contexts.length === 0) return ''
  
  let summary = '\n\n[DOCUMENT CONTEXT - Use this information to enhance your response:]\n'
  
  contexts.forEach((ctx, index) => {
    summary += `\nDocument ${index + 1}: ${ctx.fileName}\n`
    summary += `Content Summary: ${ctx.summary}\n`
    summary += `Key Information: ${ctx.keyPoints.join(', ')}\n`
    // Include a portion of the actual content for better context
    const contentPreview = ctx.content.length > 500 ? ctx.content.substring(0, 500) + '...' : ctx.content
    summary += `Content Preview: ${contentPreview}\n`
  })
  
  summary += '\n[END DOCUMENT CONTEXT]\n'
  
  return summary
}

/**
 * Inject context into a chat message
 * @param message The original message
 * @param sessionId The session ID
 * @returns The message with context injected
 */
export function injectContext(message: string, sessionId: string): string {
  const contextSummary = generateContextSummary(sessionId)
  
  if (!contextSummary) return message
  
  // Add a clear instruction that the AI should use this context
  return `${message}${contextSummary}\n\nPlease use the document context above to enhance your response.`
}

/**
 * Get all session contexts (for admin UI)
 * @returns All session contexts
 */
export function getAllSessionContexts(): SessionContext[] {
  return Object.values(sessionContexts)
}

/**
 * Remove a specific document context from a session
 * @param sessionId The session ID
 * @param documentId The document ID to remove
 */
export function removeDocumentContext(sessionId: string, documentId: string): void {
  if (sessionContexts[sessionId]) {
    sessionContexts[sessionId].documentContexts = 
      sessionContexts[sessionId].documentContexts.filter(ctx => ctx.id !== documentId)
    sessionContexts[sessionId].updatedAt = new Date().toISOString()
  }
}
