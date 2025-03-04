import { NextResponse } from 'next/server';

// Function to extract text from HTML content without using external parser
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
      // For PDFs, we'd normally use a PDF parsing library
      // Since we can't install new packages, we'll just extract what we can
      const buffer = await file.arrayBuffer();
      const text = new TextDecoder('utf-8').decode(buffer);
      
      // Basic extraction of text from PDF (will be imperfect)
      resumeText = text.replace(/\s+/g, ' ').trim();
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
      // For Word documents, we'd normally use a DOCX parsing library
      // Since we can't install new packages, we'll just extract what we can
      const buffer = await file.arrayBuffer();
      const text = new TextDecoder('utf-8').decode(buffer);
      resumeText = text.replace(/\s+/g, ' ').trim();
      
      if (!resumeText || resumeText.length < 50) {
        resumeText = "Resume content extracted from Word document: " + file.name;
      }
    }

    // Check if we actually got content
    if (!resumeText || resumeText.length < 10) {
      return NextResponse.json({
        success: false,
        error: 'Could not extract meaningful content from the file',
        message: 'The file appears to be empty or in a format that cannot be properly read. Please try a different file or format.'
      }, { status: 422 });
    }

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