// Test script for document generation workflow

import { isDocumentRequest, suggestDocumentGeneration } from "./lib/document-request-detector"
import { generateMockReport, saveGeneratedReport } from "./lib/mock-report-generator"

async function testDocumentGeneration() {
  console.log('Testing document generation workflow...')
  
  // Test cases
  const testCases = [
    "Can you generate a marketing report for our new product?",
    "Please create a financial analysis document for Q3.",
    "I need a project plan for the upcoming launch.",
    "Write a summary of our customer feedback.",
    "Hello, how are you today?", // Not a document request
    "What's the weather like?" // Not a document request
  ]
  
  for (const testCase of testCases) {
    console.log(`\nTesting: "${testCase}"`)
    
    // Test document request detection
    const isRequest = isDocumentRequest(testCase)
    console.log(`Is document request: ${isRequest}`)
    
    if (isRequest) {
      // Test suggestion generation
      const suggestion = suggestDocumentGeneration(testCase)
      console.log(`Suggestion: ${suggestion}`)
      
      // Test document generation
      try {
        const documentRequest = {
          id: `req-${Date.now()}`,
          session_id: 'test-session-123',
          prompt: testCase,
          created_at: new Date().toISOString(),
          status: 'pending' as const
        }
        
        console.log('Generating mock report...')
        const report = await generateMockReport(documentRequest)
        console.log('Report generated:', report.title)
        
        console.log('Saving report...')
        const savedReport = await saveGeneratedReport(report)
        console.log('Report saved:', savedReport.id)
      } catch (error) {
        console.error('Error in document generation:', error)
      }
    }
  }
  
  console.log('\nDocument generation workflow test completed.')
}

// Run the test
testDocumentGeneration().catch(console.error)
