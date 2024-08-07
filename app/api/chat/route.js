import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const MODEL_NAME = 'gemini-pro'

export async function POST(req) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables')
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const messages = await req.json()
  console.log('Received messages:', messages)

  // Prepare the conversation history
  const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')
  const prompt = `${conversationHistory}\nassistant:`
  console.log('Prompt:', prompt)

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const aiResponse = response.text()

    console.log('API Response:', aiResponse)

    if (!aiResponse) {
      return NextResponse.json({ error: 'No generated text in the response' }, { status: 500 })
    }

    return NextResponse.json({ message: aiResponse })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}