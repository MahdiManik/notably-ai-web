import 'openai/shims/node'

import OpenAI from 'openai'
import { z } from 'zod'

const openaiApiKey = process.env.OPENAI_API_KEY

const openai = openaiApiKey
  ? new OpenAI({
      apiKey: openaiApiKey,
      dangerouslyAllowBrowser: true,
    })
  : null

export const summarizeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
})

export type SummarizeInput = z.infer<typeof summarizeSchema>

export async function summarizeArticle(input: SummarizeInput): Promise<string> {
  const { title, body } = summarizeSchema.parse(input)

  // If no OpenAI API key, return mock summary
  if (!openai) {
    return generateMockSummary(title, body)
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that creates concise, informative summaries of articles. Keep summaries to 2-3 sentences maximum.',
        },
        {
          role: 'user',
          content: `Please summarize this article:\n\nTitle: ${title}\n\nContent: ${body}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.3,
    })

    return (
      response.choices[0]?.message?.content || generateMockSummary(title, body)
    )
  } catch (error) {
    console.error('OpenAI API error:', error)
    return generateMockSummary(title, body)
  }
}

function generateMockSummary(title: string, body: string): string {
  const wordCount = body.split(' ').length
  const firstSentence = body.split('.')[0] + '.'

  return `This article titled "${title}" contains approximately ${wordCount} words. ${firstSentence} This is a mock summary generated when OpenAI API is not available.`
}
