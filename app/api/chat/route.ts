import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages, sessionId, gptName } = await req.json()

  // In a real app, you would:
  // 1. Validate the session belongs to the authenticated user
  // 2. Save new messages to the database
  // 3. Update the session's updated_at timestamp
  // 4. Use the specific GPT's configuration and context

  const systemPrompt = `You are ${gptName}, a helpful AI assistant for the GPTWorkDesk platform. 
${sessionId ? `This is a continuation of session ${sessionId}.` : "This is a new conversation."}
Provide concise and relevant answers based on your role as ${gptName}.`

  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
    system: systemPrompt,
  })

  return result.toDataStreamResponse()
}
