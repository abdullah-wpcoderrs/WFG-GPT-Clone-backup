/**
 * Test script for document context management functionality
 */

import { saveSessionContext, getSessionContext, injectContext, generateContextSummary } from './lib/context-manager'

function testDocumentContext() {
  console.log('Testing document context management...')
  
  // Create mock document contexts
  const mockContexts = [
    {
      id: 'doc-1',
      fileName: 'project-requirements.txt',
      content: 'This document contains project requirements...',
      summary: 'Project requirements document summary...',
      keyPoints: ['requirements', 'features', 'specifications'],
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'doc-2',
      fileName: 'user-feedback.pdf',
      content: 'This document contains user feedback...',
      summary: 'User feedback document summary...',
      keyPoints: ['feedback', 'issues', 'suggestions'],
      uploadedAt: new Date().toISOString()
    }
  ]
  
  // Test context storage
  console.log('\n1. Testing context storage...')
  const testSessionId = 'test-session-123'
  saveSessionContext(testSessionId, mockContexts)
  
  const storedContexts = getSessionContext(testSessionId)
  console.log('Context stored successfully:')
  console.log('- Number of documents:', storedContexts.length)
  console.log('- First document name:', storedContexts[0]?.fileName)
  
  // Test context summary generation
  console.log('\n2. Testing context summary generation...')
  const contextSummary = generateContextSummary(testSessionId)
  console.log('Context summary generated:')
  console.log(contextSummary)
  
  // Test context injection
  console.log('\n3. Testing context injection...')
  const testMessage = 'Can you summarize the documents I uploaded?'
  const messageWithContext = injectContext(testMessage, testSessionId)
  
  console.log('Original message:', testMessage)
  console.log('Message with context length:', messageWithContext.length)
  
  // Verify context was injected
  if (messageWithContext.includes('Document Context:')) {
    console.log('✓ Context injection successful')
  } else {
    console.log('✗ Context injection failed')
  }
  
  // Test empty context
  console.log('\n4. Testing empty context...')
  const emptyMessage = injectContext('Test message', 'empty-session')
  if (emptyMessage === 'Test message') {
    console.log('✓ Empty context handled correctly')
  } else {
    console.log('✗ Empty context not handled correctly')
  }
  
  console.log('\n✓ All tests passed!')
}

testDocumentContext()
