// Chat memory management utility

import { ChatMessage } from "@/types"

// Memory item structure
export interface MemoryItem {
  id: string
  sessionId: string
  prompt: string
  response: string
  timestamp: number
  tags: string[]
}

// Memory storage key
const MEMORY_KEY = 'gpt-desk-chat-memory'

/**
 * Save a chat interaction to memory
 * @param sessionId The session ID
 * @param prompt The user's prompt
 * @param response The GPT's response
 * @param tags Optional tags for categorization
 */
export function saveToMemory(
  sessionId: string,
  prompt: string,
  response: string,
  tags: string[] = []
): void {
  try {
    // Get existing memory
    const memory = getMemory()
    
    // Create new memory item
    const memoryItem: MemoryItem = {
      id: `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      prompt,
      response,
      timestamp: Date.now(),
      tags
    }
    
    // Add to memory
    memory.push(memoryItem)
    
    // Save to localStorage
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory))
  } catch (error) {
    console.error('Error saving to memory:', error)
  }
}

/**
 * Get all memory items
 * @returns MemoryItem[] Array of memory items
 */
export function getMemory(): MemoryItem[] {
  try {
    const memoryStr = localStorage.getItem(MEMORY_KEY)
    return memoryStr ? JSON.parse(memoryStr) : []
  } catch (error) {
    console.error('Error retrieving memory:', error)
    return []
  }
}

/**
 * Get memory items for a specific session
 * @param sessionId The session ID
 * @returns MemoryItem[] Array of memory items for the session
 */
export function getSessionMemory(sessionId: string): MemoryItem[] {
  const memory = getMemory()
  return memory.filter(item => item.sessionId === sessionId)
}

/**
 * Get memory items with specific tags
 * @param tags Array of tags to filter by
 * @returns MemoryItem[] Array of memory items with the tags
 */
export function getTaggedMemory(tags: string[]): MemoryItem[] {
  const memory = getMemory()
  return memory.filter(item => 
    tags.some(tag => item.tags.includes(tag))
  )
}

/**
 * Clear all memory
 */
export function clearMemory(): void {
  try {
    localStorage.removeItem(MEMORY_KEY)
  } catch (error) {
    console.error('Error clearing memory:', error)
  }
}

/**
 * Remove a specific memory item
 * @param id The ID of the memory item to remove
 */
export function removeMemoryItem(id: string): void {
  try {
    const memory = getMemory()
    const filteredMemory = memory.filter(item => item.id !== id)
    localStorage.setItem(MEMORY_KEY, JSON.stringify(filteredMemory))
  } catch (error) {
    console.error('Error removing memory item:', error)
  }
}

/**
 * Get recent memory items
 * @param limit Number of recent items to retrieve
 * @returns MemoryItem[] Array of recent memory items
 */
export function getRecentMemory(limit: number = 10): MemoryItem[] {
  const memory = getMemory()
  return memory
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
}

/**
 * Search memory items by prompt or response content
 * @param query Search query
 * @returns MemoryItem[] Array of matching memory items
 */
export function searchMemory(query: string): MemoryItem[] {
  const memory = getMemory()
  const lowerQuery = query.toLowerCase()
  
  return memory.filter(item => 
    item.prompt.toLowerCase().includes(lowerQuery) ||
    item.response.toLowerCase().includes(lowerQuery)
  )
}
