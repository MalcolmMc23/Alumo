import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

// Function to extract text from HTML content
function extractTextFromHTML(html: string): string {
  // Simple regex to strip HTML tags
  return html.replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to extract text from plain text
function extractTextFromPlainText(text: string): string {
  return text.trim();
}

export async function POST(request: Request) {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    const fileType = file.type;
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/html',
      'application/html'
    ];
    
    if (!validTypes.includes(fileType)) {
      return NextResponse.json(
        { 
          error: 'Unsupported file type', 
          message: 'Please upload a resume in PDF, DOC, DOCX, TXT, or HTML format.',
          supportedFormats: ['PDF', 'DOC', 'DOCX', 'TXT', 'HTML']
        },
        { status: 400 }
      );
    }
    
    let resumeText = '';

    if (fileType === 'application/pdf') {
      // For PDFs, don't try to extract text directly from binary
      // Store a placeholder instead
      resumeText = `Resume content from PDF: ${file.name}`;
    } else if (fileType === 'text/plain') {
      // For plain text files
      const text = await file.text();
      resumeText = extractTextFromPlainText(text);
    } else if (fileType === 'text/html' || fileType === 'application/html') {
      // For HTML files
      const html = await file.text();
      resumeText = extractTextFromHTML(html);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               fileType === 'application/msword') {
      // For Word documents, don't try to extract text directly from binary
      // Store a placeholder instead
      resumeText = `Resume content from Word document: ${file.name}`;
    }

    // Check if we actually got content
    if (!resumeText || resumeText.length < 10) {
      return NextResponse.json({
        success: false,
        error: 'Could not extract meaningful content from the file',
        message: 'The file appears to be empty or in a format that cannot be properly read. Please try a different file or format.'
      }, { status: 422 });
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user with resume data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // @ts-ignore - Fields exist in database but TypeScript hasn't updated
        hasResume: true,
        resumeText: resumeText,
        resumeFileName: file.name,
        resumeFileType: fileType
      }
    } as any); // Type assertion to bypass TypeScript checks

    return NextResponse.json({
      success: true,
      filename: file.name,
      fileType: fileType,
      resumeText: resumeText
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process resume',
        message: 'An unexpected error occurred while processing your resume. Please try again with a different file.'
      },
      { status: 500 }
    );
  }
} 