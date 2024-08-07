import { NextResponse } from 'next/server'
import fetch from 'node-fetch'

console.log('Node environment:', process.env.NODE_ENV)
console.log('All environment variables:', process.env)

const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium'
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY
console.log('API Key set:', !!HF_API_KEY)

export async function POST(req) {
  if (!HF_API_KEY) {
    console.error('HUGGINGFACE_API_KEY is not set in environment variables')
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const data = await req.json()
  console.log('Received data:', data)
  const userMessage = data[data.length - 1].content
  console.log('User message:', userMessage)

  const requestBody = JSON.stringify({ inputs: userMessage })
  console.log('Request body:', requestBody)

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: requestBody,
  })

  console.log('Response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Error response:', errorText)
    throw new Error(`Hugging Face API error: ${response.status} ${errorText}`)
  }

  const result = await response.json()
  console.log('API Response:', result)

  if (!result || !Array.isArray(result) || result.length === 0) {
    throw new Error('Unexpected response format from API')
  }

  const aiResponse = result[0].generated_text

  if (!aiResponse) {
    throw new Error('No generated text in the response')
  }

  return NextResponse.json({ message: aiResponse })
}