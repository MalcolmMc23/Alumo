import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-v', // Using environment variable with fallback
  defaultHeaders: {
    'HTTP-Referer': 'https://alumo.app',
    'X-Title': 'Alumo',
  },
});

// Define message interface
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { message, history = [] } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Prepare messages array with history and new message
    let messages: ChatMessage[] = [];
    
    // Add system message for context
    messages.push({
      role: 'system',
      content: 'You are a helpful AI assistant for Alumo, a career center platform that helps college students with job searches and connecting with alumni. Provide helpful, concise, and accurate responses.'
    });
    
    // Add conversation history
    if (Array.isArray(history) && history.length > 0) {
      messages = [...messages, ...history];
    }
    
    // Add the new user message
    messages.push({
      role: 'user',
      content: message
    });

    // Call the OpenRouter API
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
      messages: messages,
    });

    // Get the assistant's response
    const assistantMessage = completion.choices[0].message;
    
    // Return both the response and the updated history
    return NextResponse.json({
      message: assistantMessage.content,
      history: [
        ...messages,
        {
          role: 'assistant',
          content: assistantMessage.content || ''
        }
      ]
    });
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
} 