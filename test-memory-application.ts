// Test script for memory application in chat sessions with localStorage mock

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
  let store: { [key: string]: string } = {}
  
  return {
    getItem(key: string) {
      return store[key] || null
    },
    setItem(key: string, value: string) {
      store[key] = value
    },
    removeItem(key: string) {
      delete store[key]
    },
    clear() {
      store = {}
    }
  }
})()

global.localStorage = localStorageMock as any

import { saveToMemory, getMemory, getSessionMemory, getTaggedMemory, searchMemory, clearMemory } from "./lib/chat-memory"
import { learnFromMemory, getLearnedResponse, getPatternSuggestions, getLearningStats } from "./lib/chat-learner"

async function testMemoryApplication() {
  console.log('Testing memory application in chat sessions...')
  
  // Clear existing memory for a clean test
  clearMemory()
  
  // Test cases for memory storage
  // Adding identical prompts to test the learning algorithm
  // Creating multiple identical prompts to meet the minimum frequency threshold of 3
  const testInteractions = [
    // Identical weather-related prompts (5 identical prompts)
    {
      sessionId: 'session-123',
      prompt: 'What is the weather like today?',
      response: 'The weather is sunny with a high of 75°F.',
      tags: ['chat']
    },
    {
      sessionId: 'session-123',
      prompt: 'What is the weather like today?',
      response: 'The weather is partly cloudy with a high of 72°F.',
      tags: ['chat']
    },
    {
      sessionId: 'session-123',
      prompt: 'What is the weather like today?',
      response: 'The weather is rainy with a high of 65°F.',
      tags: ['chat']
    },
    {
      sessionId: 'session-123',
      prompt: 'What is the weather like today?',
      response: 'The weather is sunny with a high of 78°F.',
      tags: ['chat']
    },
    {
      sessionId: 'session-123',
      prompt: 'What is the weather like today?',
      response: 'The weather is cloudy with a high of 70°F.',
      tags: ['chat']
    },
    
    // Identical document generation prompts (5 identical prompts)
    {
      sessionId: 'session-123',
      prompt: 'Can you generate a report?',
      response: 'I\'ve generated a report for you. You can download it using the download button.',
      tags: ['document-request']
    },
    {
      sessionId: 'session-123',
      prompt: 'Can you generate a report?',
      response: 'I\'ve created a report for you. You can download it using the download button.',
      tags: ['document-request']
    },
    {
      sessionId: 'session-123',
      prompt: 'Can you generate a report?',
      response: 'I\'ve produced a report for you. You can download it using the download button.',
      tags: ['document-request']
    },
    {
      sessionId: 'session-123',
      prompt: 'Can you generate a report?',
      response: 'I\'ve made a report for you. You can download it using the download button.',
      tags: ['document-request']
    },
    {
      sessionId: 'session-123',
      prompt: 'Can you generate a report?',
      response: 'I\'ve prepared a report for you. You can download it using the download button.',
      tags: ['document-request']
    },
    
    // Identical policy-related prompts (4 identical prompts)
    {
      sessionId: 'session-123',
      prompt: 'What are the policies?',
      response: 'Our policies include remote work guidelines, dress code, and vacation policies.',
      tags: ['chat']
    },
    {
      sessionId: 'session-123',
      prompt: 'What are the policies?',
      response: 'Our policies cover remote work, dress code, and vacation guidelines.',
      tags: ['chat']
    },
    {
      sessionId: 'session-123',
      prompt: 'What are the policies?',
      response: 'The policies include remote work rules, dress code, and vacation procedures.',
      tags: ['chat']
    },
    {
      sessionId: 'session-123',
      prompt: 'What are the policies?',
      response: 'Our company policies cover remote work, dress code, and vacation time.',
      tags: ['chat']
    },
    
    // Identical expense-related prompts (3 identical prompts)
    {
      sessionId: 'session-456',
      prompt: 'How do I submit expenses?',
      response: 'You can submit expenses through the finance portal.',
      tags: ['chat']
    },
    {
      sessionId: 'session-456',
      prompt: 'How do I submit expenses?',
      response: 'Expenses can be submitted through the finance portal.',
      tags: ['chat']
    },
    {
      sessionId: 'session-456',
      prompt: 'How do I submit expenses?',
      response: 'Submit your expenses through the finance portal.',
      tags: ['chat']
    }
  ]
  
  // Save test interactions to memory
  console.log('\nSaving test interactions to memory...')
  for (const interaction of testInteractions) {
    saveToMemory(
      interaction.sessionId,
      interaction.prompt,
      interaction.response,
      interaction.tags
    )
    console.log(`Saved: ${interaction.prompt}`)
  }
  
  // Test memory retrieval
  console.log('\nTesting memory retrieval...')
  const allMemory = getMemory()
  console.log(`Total memory items: ${allMemory.length}`)
  
  const sessionMemory = getSessionMemory('session-123')
  console.log(`Session 123 memory items: ${sessionMemory.length}`)
  
  const taggedMemory = getTaggedMemory(['document-request'])
  console.log(`Document request memory items: ${taggedMemory.length}`)
  
  const searchResults = searchMemory('weather')
  console.log(`Search results for "weather": ${searchResults.length}`)
  
  // Test learning algorithm
  console.log('\nTesting learning algorithm...')
  const patterns = learnFromMemory()
  console.log(`Learned patterns: ${patterns.length}`)
  
  for (const pattern of patterns) {
    console.log(`Pattern: ${pattern.pattern} (frequency: ${pattern.frequency})`)
  }
  
  // Test learned response generation
  console.log('\nTesting learned response generation...')
  const testPrompts = [
    'What is the weather forecast?',
    'Can you generate a sales report?',
    'How do I check company policies?'
  ]
  
  for (const prompt of testPrompts) {
    const learnedResponse = getLearnedResponse(prompt)
    console.log(`Prompt: "${prompt}"`)
    console.log(`Learned response: ${learnedResponse || 'No learned response found'}`)
    
    const suggestions = getPatternSuggestions(prompt, 3)
    console.log(`Pattern suggestions: ${suggestions.length}`)
  }
  
  // Test learning stats
  console.log('\nTesting learning stats...')
  const stats = getLearningStats()
  console.log('Learning stats:', stats)
  
  console.log('\nMemory application test completed.')
}

// Run the test
testMemoryApplication().catch(console.error)
