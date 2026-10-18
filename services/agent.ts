import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import type { ParsedReminder } from '@/types'

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || ''

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash',
  apiKey,
})

const parseReminderTool = tool(
  async (input) => JSON.stringify(input),
  {
    name: 'parse_reminder',
    description: 'Extract and structure reminder info from Urdu or English speech',
    schema: z.object({
      title: z.string().describe('Short English task title, max 5 words, imperative form e.g. Go to Gym'),
      day: z.string().describe('Relative day: today | tomorrow | monday | tuesday etc'),
      time: z.string().nullable().describe('24hr format HH:MM, or null if no time mentioned'),
      hasAlarm: z.boolean().describe('true if time was mentioned'),
    }),
  }
)

const agentWithTools = model.bindTools([parseReminderTool])

export const parseVoiceInput = async (urduText: string): Promise<ParsedReminder> => {
  try {
    const result = await agentWithTools.invoke([
      {
        role: 'system',
        content: `You are a reminder parser. User speaks in Urdu or English.
Always call parse_reminder tool.
Convert task title to English.
Detect day and time accurately.
If day not mentioned, default to "today".
If no time mentioned, set hasAlarm: false, time: null.`
      },
      { role: 'user', content: urduText }
    ])

    const toolCall = result.tool_calls?.[0]
    if (!toolCall) {
      throw new Error('Agent did not return tool call')
    }
    return toolCall.args as unknown as ParsedReminder
  } catch (error) {
    console.error('Error parsing voice input with LangChain agent:', error)
    throw error
  }
}
