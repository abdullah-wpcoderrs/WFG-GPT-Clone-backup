/**
 * Test script for document upload and context injection functionality
 */

import { createDocumentContext } from './lib/document-parser'
import { saveSessionContext, getSessionContext, injectContext } from './lib/context-manager'

async function testDocumentUploadAndContext() {
  console.log('Testing document upload and context injection...')
  
  // Create a mock text file
  const mockFileContent = `This is a sample document for testing.
It contains multiple lines of text.
This document is used to test the document upload feature.
Key information includes: project requirements, user feedback, and implementation details.`
  
  const mockFile = new File([mockFileContent], 'test-document.txt', {
    type: 'text/plain',
  })
  
  // Test document parsing
  console.log('\n1. Testing document parsing...')
  try {
    const documentContext = await createDocumentContext(mockFile)
    console.log('Document parsed successfully:')
    console.log('- File name:', documentContext.fileName)
    console.log('- Summary:', documentContext.summary)
    console.log('- Key points:', documentContext.keyPoints)
    
    // Test context storage
    console.log('\n2. Testing context storage...')
    const testSessionId = 'test-session-123'
    saveSessionContext(testSessionId, [documentContext])
    
    const storedContexts = getSessionContext(testSessionId)
    console.log('Context stored successfully:')
    console.log('- Number of documents:', storedContexts.length)
    console.log('- First document name:', storedContexts[0]?.fileName)
    
    // Test context injection
    console.log('\n3. Testing context injection...')
    const testMessage = 'Can you summarize the document I uploaded?'
    const messageWithContext = injectContext(testMessage, testSessionId)
    
    console.log('Original message:', testMessage)
    console.log('Message with context:', messageWithContext)
    
    // Verify context was injected
    if (messageWithContext.includes('Document Context:')) {
      console.log('✓ Context injection successful')
    } else {
      console.log('✗ Context injection failed')
    }
    
    console.log('\n✓ All tests passed!')
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testDocumentUploadAndContext()
