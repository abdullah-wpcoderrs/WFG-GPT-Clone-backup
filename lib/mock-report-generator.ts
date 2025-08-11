// Mock report generation service

import { Document, DocumentReport, DocumentRequest } from "@/types"

// Mock document templates for different types of reports
const DOCUMENT_TEMPLATES = {
  report: `# {title}

## Executive Summary
{summary}

## Key Findings
{findings}

## Recommendations
{recommendations}

## Next Steps
{nextSteps}

## Conclusion
{conclusion}`,
  
  analysis: `# {title}

## Overview
{overview}

## Methodology
{methodology}

## Data Analysis
{dataAnalysis}

## Insights
{insights}

## Conclusion
{conclusion}`,
  
  plan: `# {title}

## Objectives
{objectives}

## Scope
{scope}

## Timeline
{timeline}

## Resources
{resources}

## Risks
{risks}

## Success Metrics
{successMetrics}`,
  
  proposal: `# {title}

## Introduction
{introduction}

## Problem Statement
{problemStatement}

## Proposed Solution
{solution}

## Benefits
{benefits}

## Implementation
{implementation}

## Budget
{budget}

## Conclusion
{conclusion}`
}

/**
 * Generates a mock document report based on user request
 * @param request The document request details
 * @returns Promise<DocumentReport> The generated document report
 */
export async function generateMockReport(request: DocumentRequest): Promise<DocumentReport> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Determine document type from prompt keywords
  const promptLower = request.prompt.toLowerCase()
  let docType = 'report'
  
  if (promptLower.includes('analysis')) docType = 'analysis'
  else if (promptLower.includes('plan')) docType = 'plan'
  else if (promptLower.includes('proposal')) docType = 'proposal'
  
  const template = DOCUMENT_TEMPLATES[docType as keyof typeof DOCUMENT_TEMPLATES] || DOCUMENT_TEMPLATES.report
  
  // Generate mock content based on request
  const content = template
    .replace('{title}', `Document for Session ${request.session_id}`)
    .replace('{summary}', `This ${docType} provides a comprehensive overview of the requested topic. The analysis covers key aspects and delivers actionable insights.`)
    .replace('{findings}', 'Key findings include market trends, user behavior patterns, and competitive landscape analysis.')
    .replace('{recommendations}', 'Based on the analysis, we recommend implementing strategic initiatives to optimize performance.')
    .replace('{nextSteps}', 'Next steps include stakeholder review, implementation planning, and progress monitoring.')
    .replace('{conclusion}', 'This document serves as a foundation for informed decision-making and strategic planning.')
    .replace('{overview}', 'This analysis provides a detailed examination of the subject matter with supporting data.')
    .replace('{methodology}', 'The research methodology includes data collection, analysis frameworks, and validation processes.')
    .replace('{dataAnalysis}', 'Data analysis reveals significant patterns and correlations that inform strategic direction.')
    .replace('{insights}', 'Key insights derived from the analysis offer valuable perspectives for decision-making.')
    .replace('{objectives}', 'The primary objectives of this plan are to achieve defined goals within specified constraints.')
    .replace('{scope}', 'The scope encompasses all relevant areas while maintaining focus on core objectives.')
    .replace('{timeline}', 'The implementation timeline spans the required duration with defined milestones.')
    .replace('{resources}', 'Required resources include personnel, technology, and financial allocations.')
    .replace('{risks}', 'Potential risks have been identified with corresponding mitigation strategies.')
    .replace('{successMetrics}', 'Success will be measured through defined KPIs and performance indicators.')
    .replace('{introduction}', 'This proposal introduces a comprehensive solution to address the identified challenge.')
    .replace('{problemStatement}', 'The problem statement clearly defines the challenge and its impact on operations.')
    .replace('{solution}', 'The proposed solution offers an innovative approach to resolve the identified issues.')
    .replace('{benefits}', 'The solution provides measurable benefits including cost savings and efficiency gains.')
    .replace('{implementation}', 'Implementation follows a structured approach with clear phases and deliverables.')
    .replace('{budget}', 'The estimated budget accounts for all necessary resources and contingencies.')
  
  // Create document report
  const report: DocumentReport = {
    id: `report-${Date.now()}`,
    session_id: request.session_id,
    title: `Generated Document for Session ${request.session_id}`,
    content: content,
    format: 'pdf',
    created_at: new Date().toISOString(),
    generated_by: 'mock-generator',
    status: 'completed'
  }
  
  return report
}

/**
 * Saves a generated document report
 * @param report The document report to save
 * @returns Promise<DocumentReport> The saved document report
 */
export async function saveGeneratedReport(report: DocumentReport): Promise<DocumentReport> {
  // Simulate saving to database
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // In a real implementation, this would save to a database
  // For now, we just return the report as-is
  return report
}

/**
 * Gets a list of generated reports for a session
 * @param sessionId The session ID
 * @returns Promise<DocumentReport[]> List of document reports
 */
export async function getReportsForSession(sessionId: string): Promise<DocumentReport[]> {
  // Simulate fetching from database
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Return empty array for now (in a real app, this would fetch from DB)
  return []
}
