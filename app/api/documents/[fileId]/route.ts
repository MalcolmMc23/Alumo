import { NextRequest, NextResponse } from 'next/server';
import { createEditorConfig, generateDocumentJWT } from '@/lib/documents/documentUtils';
import { join } from 'path';
import { readdir } from 'fs/promises';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId;
    
    if (!fileId) {
      return NextResponse.json({ message: 'File ID is required' }, { status: 400 });
    }

    // Find the file in the uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const files = await readdir(uploadsDir);
    
    // Find the file with the given fileId prefix
    const targetFile = files.find(file => file.startsWith(fileId));
    
    if (!targetFile) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    // Extract the original filename from the stored file
    const originalFileName = targetFile.substring(fileId.length + 1); // +1 for the hyphen
    
    // Create file URL using the server's public IP directly
    const serverIP = '5.78.66.245'; // Use your server's public IP
    const fileUrl = `http://${serverIP}:3000/uploads/${targetFile}`;

    // Mock user data (in a real app, this would come from the authenticated session)
    const userId = 'user-1';
    const userName = 'Test User';

    // Create editor configuration
    const editorConfig = createEditorConfig(
      fileId,
      originalFileName,
      fileUrl,
      userId,
      userName
    );

    // Generate JWT token for secure editing
    const token = generateDocumentJWT(editorConfig);

    return NextResponse.json({
      config: editorConfig,
      token
    });
  } catch (error) {
    console.error('Error getting document:', error);
    return NextResponse.json(
      { message: `Failed to get document: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 