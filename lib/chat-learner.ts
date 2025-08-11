// Chat learning algorithm for prompt/response tracking

import { MemoryItem, getMemory, getTaggedMemory, searchMemory } from "@/lib/chat-memory"

// Pattern structure
export interface ChatPattern {
  id: string
  pattern: string
  responseTemplate: string
  frequency: number
  lastUsed: number
  tags: string[]
}

// Learning configuration
const LEARNING_CONFIG = {
  // Minimum frequency to consider a pattern significant
  minFrequency: 3,
  // How much to decay frequency over time (per day)
  decayRate: 0.1,
  // Maximum number of patterns to keep
  maxPatterns: 50,
  // Similarity threshold for pattern matching (0-1)
  similarityThreshold: 0.8
}

/**
 * Extract keywords from a text
 * @param text Input text
 * @returns Array of keywords
 */
function extractKeywords(text: string): string[] {
  // Simple keyword extraction (in a real implementation, you might use NLP libraries)
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
}

/**
 * Calculate similarity between two strings
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity score (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  // Simple similarity calculation (in a real implementation, you might use more sophisticated algorithms)
  const words1 = new Set(str1.toLowerCase().split(/\s+/))
  const words2 = new Set(str2.toLowerCase().split(/\s+/))
  
  const intersection = new Set([...words1].filter(x => words2.has(x)))
  const union = new Set([...words1, ...words2])
  
  return union.size === 0 ? 0 : intersection.size / union.size
}

/**
 * Find similar patterns in memory
 * @param prompt New prompt
 * @param patterns Existing patterns
 * @returns Array of similar patterns
 */
function findSimilarPatterns(prompt: string, patterns: ChatPattern[]): ChatPattern[] {
  return patterns.filter(pattern => 
    calculateSimilarity(prompt, pattern.pattern) >= LEARNING_CONFIG.similarityThreshold
  )
}

/**
 * Generate a response template from a response
 * @param response The response text
 * @returns Simplified template
 */
function generateResponseTemplate(response: string): string {
  // Simple template generation (in a real implementation, you might use more sophisticated methods)
  return response
    .replace(/\d+/g, '{number}')
    .replace(/\$[0-9,.]+/g, '{amount}')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '{email}')
    .replace(/https?:\/\/[^\s]+/gi, '{url}')
}

/**
 * Learn from chat memory
 * @returns Array of learned patterns
 */
export function learnFromMemory(): ChatPattern[] {
  try {
    // Get all chat memory
    const chatMemory = getTaggedMemory(['chat'])
    
    // Group by similar prompts
    const patternMap = new Map<string, { count: number, responses: string[], lastUsed: number, tags: string[] }>()
    
    for (const item of chatMemory) {
      // Extract keywords as a simple pattern
      const keywords = extractKeywords(item.prompt).join(' ')
      
      if (keywords) {
        if (!patternMap.has(keywords)) {
          patternMap.set(keywords, {
            count: 0,
            responses: [],
            lastUsed: 0,
            tags: []
          })
        }
        
        const patternData = patternMap.get(keywords)!
        patternData.count += 1
        patternData.responses.push(item.response)
        patternData.lastUsed = Math.max(patternData.lastUsed, item.timestamp)
        
        // Add tags from the memory item
        for (const tag of item.tags) {
          if (!patternData.tags.includes(tag)) {
            patternData.tags.push(tag)
          }
        }
      }
    }
    
    // Convert to ChatPattern array
    const patterns: ChatPattern[] = []
    
    for (const [pattern, data] of patternMap.entries()) {
      // Only consider patterns that occur frequently enough
      if (data.count >= LEARNING_CONFIG.minFrequency) {
        // Generate a response template from the most common response
        const responseTemplate = data.responses.length > 0 
          ? generateResponseTemplate(data.responses[0])
          : "{response}"
        
        patterns.push({
          id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          pattern,
          responseTemplate,
          frequency: data.count,
          lastUsed: data.lastUsed,
          tags: data.tags
        })
      }
    }
    
    // Sort by frequency and limit
    return patterns
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, LEARNING_CONFIG.maxPatterns)
  } catch (error) {
    console.error('Error learning from memory:', error)
    return []
  }
}

/**
 * Get a learned response for a prompt
 * @param prompt User prompt
 * @returns Learned response or null if no match
 */
export function getLearnedResponse(prompt: string): string | null {
  try {
    // Get learned patterns
    const patterns = learnFromMemory()
    
    // Find similar patterns
    const similarPatterns = findSimilarPatterns(prompt, patterns)
    
    // Return the response template from the most frequent pattern
    if (similarPatterns.length > 0) {
      // Sort by frequency and return the template from the most frequent
      const bestPattern = similarPatterns.sort((a, b) => b.frequency - a.frequency)[0]
      return bestPattern.responseTemplate
    }
    
    return null
  } catch (error) {
    console.error('Error getting learned response:', error)
    return null
  }
}

/**
 * Get pattern suggestions for a prompt
 * @param prompt User prompt
 * @param limit Number of suggestions to return
 * @returns Array of pattern suggestions
 */
export function getPatternSuggestions(prompt: string, limit: number = 5): ChatPattern[] {
  try {
    // Get learned patterns
    const patterns = learnFromMemory()
    
    // Find similar patterns
    const similarPatterns = findSimilarPatterns(prompt, patterns)
    
    // Sort by frequency and return top suggestions
    return similarPatterns
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting pattern suggestions:', error)
    return []
  }
}

/**
 * Decay pattern frequencies over time
 * @param patterns Array of patterns
 * @returns Array of patterns with decayed frequencies
 */
export function decayPatternFrequencies(patterns: ChatPattern[]): ChatPattern[] {
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  
  return patterns.map(pattern => {
    const daysSinceLastUse = (now - pattern.lastUsed) / oneDay
    const decay = Math.max(0, 1 - (daysSinceLastUse * LEARNING_CONFIG.decayRate))
    
    return {
      ...pattern,
      frequency: Math.round(pattern.frequency * decay)
    }
  })
}

/**
 * Get learning statistics
 * @returns Object with learning statistics
 */
export function getLearningStats(): {
  totalInteractions: number
  learnedPatterns: number
  documentRequests: number
  errorResponses: number
} {
  try {
    const allMemory = getMemory()
    const chatMemory = getTaggedMemory(['chat'])
    const documentMemory = getTaggedMemory(['document-request'])
    const errorMemory = getTaggedMemory(['error'])
    
    const patterns = learnFromMemory()
    
    return {
      totalInteractions: allMemory.length,
      learnedPatterns: patterns.length,
      documentRequests: documentMemory.length,
      errorResponses: errorMemory.length
    }
  } catch (error) {
    console.error('Error getting learning stats:', error)
    return {
      totalInteractions: 0,
      learnedPatterns: 0,
      documentRequests: 0,
      errorResponses: 0
    }
  }
}
