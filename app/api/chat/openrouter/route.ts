import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getResumeContext, generateResumeSystemMessage } from "@/lib/resume-context";

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

// Function to handle tool calls (kept for future extension)
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
    // Get the user's session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse the request body
    const body = await request.json();
    const { message, history = [] } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get resume context if available
    const resumeContext = await getResumeContext(user.id);
    const resumeSystemMessage = generateResumeSystemMessage(resumeContext);
    
    // Prepare messages array with history and new message
    let messages: ChatMessage[] = [];
    
    // Add base system message for context
    messages.push({
      role: 'system',
      content: 'You are a helpful AI assistant for Alumo, a career center platform that helps college students with job searches and connecting with alumni. Provide helpful, concise, and accurate responses. When users specifically request job opportunities or searching for jobs, provide appropriate job listings. If the user uploads a resume, analyze it thoroughly and provide constructive feedback on format, content, skills, and opportunities for improvement, then suggest relevant job matches based on their qualifications. Format your responses using Markdown: use **bold** for emphasis, *italics* for secondary emphasis, use proper headings with # and ##, use bullet points with - or * for lists, use numbered lists with 1. 2. 3. when appropriate, use `code blocks` for technical content, and organize complex information into clear sections with headings.'
    });
    
    // Add resume system message if available
    if (resumeSystemMessage) {
      messages.push({
        role: 'system',
        content: resumeSystemMessage
      });
    }
    
    // Add conversation history
    if (Array.isArray(history) && history.length > 0) {
      messages = [...messages, ...history];
    }
    
    // Add the new user message
    messages.push({
      role: 'user',
      content: message
    });

    try {
      // Send request to OpenAI with fallback approach
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

      // Check if the user explicitly requests job listings
      // For example, if they say "search for jobs", "show me job listings", etc.
      // Adjust the condition as desired to match your trigger phrases
      const lowerCaseMessage = message.toLowerCase();
      const explicitSearchTerms = ["search for jobs", "show me job listings", "find me jobs"];
      const userWantsJobSearch = explicitSearchTerms.some(term => lowerCaseMessage.includes(term));

      // If the user explicitly requests a job search, call searchForJobs
      if (userWantsJobSearch) {
        const jobListings = searchForJobs();
        const jobListingsText = jobListings.map(job => 
          `- ${job.company}: ${job.position} (${job.salary})`
        ).join('\n');
        
        const enhancedResponse = `${assistantContent}\n\nHere are some job listings you requested:\n\n${jobListingsText}`;
        
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
        // Just return the standard assistant response
        return NextResponse.json({
          message: assistantContent,
          history: [
            ...messages,
            {
              role: 'assistant',
              content: assistantContent
            }
          ]
        });
      }
    } catch (innerError) {
      console.error('Error in primary approach:', innerError);
      
      // Fallback: just return a simple response
      // and only show jobs if the user explicitly asked for them
      const fallbackResponse = "I'm here to help with your questions. How can I assist you today?";
      const lowerCaseMessage = message.toLowerCase();
      const explicitSearchTerms = ["search for jobs", "show me job listings", "find me jobs"];
      const userWantsJobSearch = explicitSearchTerms.some(term => lowerCaseMessage.includes(term));

      if (userWantsJobSearch) {
        const jobListings = searchForJobs();
        const jobListingsText = jobListings.map(job => 
          `- ${job.company}: ${job.position} (${job.salary})`
        ).join('\n');
        
        const fallbackWithJobs = `You requested job listings. Here are some possibilities:\n\n${jobListingsText}`;
        
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
