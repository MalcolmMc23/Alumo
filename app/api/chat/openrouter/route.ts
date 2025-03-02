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

// Define function to search for jobs (returns fake listings)
function searchForJobs() {
  // Return fake job listings
  return [
    { company: "Nike", salary: "$300K per year", position: "Senior Software Engineer" },
    { company: "Google", salary: "$280K per year", position: "Product Manager" },
    { company: "Amazon", salary: "$250K per year", position: "Data Scientist" },
    { company: "Apple", salary: "$320K per year", position: "Machine Learning Engineer" },
    { company: "Microsoft", salary: "$275K per year", position: "Cloud Solutions Architect" }
  ];
}

// Define available functions for the AI
const availableFunctions = {
  searchForJobs: searchForJobs
};

// Function to handle tool calls
async function executeToolCalls(toolCalls: any[]) {
  const results = [];

  for (const toolCall of toolCalls) {
    if (toolCall.function.name === 'searchForJobs') {
      const jobListings = searchForJobs();
      results.push({
        tool_call_id: toolCall.id,
        function: { 
          name: "searchForJobs",
          arguments: "{}",
          output: JSON.stringify(jobListings)
        }
      });
    }
  }

  return results;
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
      content: 'You are a helpful AI assistant for Alumo, a career center platform that helps college students with job searches and connecting with alumni. Provide helpful, concise, and accurate responses. When users ask about job opportunities, job searches, or express interest in finding a job, provide appropriate job listings. If the user uploads a resume, analyze it thoroughly and provide constructive feedback on format, content, skills, and opportunities for improvement, then suggest relevant job matches based on their qualifications.'
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

    // For now, use a model that might not fully support function calling in OpenRouter
    // This is a fallback approach
    try {
      // First attempt - try with standard request without function calling
      const completion = await openai.chat.completions.create({
        model: 'anthropic/claude-3-haiku',
        messages: messages as any,
      });

      // Get the assistant's response
      const assistantMessage = completion.choices[0]?.message;
      
      if (!assistantMessage) {
        throw new Error('No assistant message returned');
      }
      
      const assistantContent = assistantMessage.content || "";
      
      // Parse the response to check if the assistant mentioned jobs
      const jobRelatedTerms = ['job', 'career', 'employment', 'work', 'position', 'hiring', 'opportunity'];
      const responseText = assistantContent.toLowerCase();
      const isJobRelated = jobRelatedTerms.some(term => 
        message.toLowerCase().includes(term) || responseText.includes(term)
      );
      
      // If the query is job-related, include job listings in the response
      if (isJobRelated) {
        const jobListings = searchForJobs();
        const jobListingsText = jobListings.map(job => 
          `- ${job.company}: ${job.position} (${job.salary})`
        ).join('\n');
        
        const enhancedResponse = `${assistantContent}\n\nHere are some job listings that might interest you:\n\n${jobListingsText}`;
        
        return NextResponse.json({
          message: enhancedResponse,
          history: [
            ...messages,
            {
              role: 'assistant',
              content: enhancedResponse
            }
          ]
        });
      } else {
        // Just return the standard response
        return NextResponse.json({
          message: assistantContent,
          history: [
            ...messages,
            {
              role: 'assistant',
              content: assistantContent as string
            }
          ]
        });
      }
    } catch (innerError) {
      console.error('Error in primary approach:', innerError);
      
      // Fallback: Just return a simple response
      const fallbackResponse = "I'm here to help with your job search and career questions. How can I assist you today?";
      
      if (message.toLowerCase().includes('job') || 
          message.toLowerCase().includes('work') || 
          message.toLowerCase().includes('career') ||
          message.toLowerCase().includes('employment')) {
        
        const jobListings = searchForJobs();
        const jobListingsText = jobListings.map(job => 
          `- ${job.company}: ${job.position} (${job.salary})`
        ).join('\n');
        
        const fallbackWithJobs = `I found some job listings that might interest you:\n\n${jobListingsText}`;
        
        return NextResponse.json({
          message: fallbackWithJobs,
          history: [
            ...messages,
            {
              role: 'assistant',
              content: fallbackWithJobs
            }
          ]
        });
      }
      
      return NextResponse.json({
        message: fallbackResponse,
        history: [
          ...messages,
          {
            role: 'assistant',
            content: fallbackResponse
          }
        ]
      });
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
} 