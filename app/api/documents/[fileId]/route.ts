import { NextRequest, NextResponse } from 'next/server';
import { createEditorConfig, generateDocumentJWT, validateOnlyOfficeEnvironment } from '@/lib/documents/documentUtils';
import { join } from 'path';
import { readdir } from 'fs/promises';
import { logger } from '@/lib/logging';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    // Validate ONLYOFFICE environment before processing
    if (!validateOnlyOfficeEnvironment()) {
      return NextResponse.json({ 
        message: 'ONLYOFFICE environment misconfigured, check server logs' 
      }, { status: 500 });
    }
    
    const fileId = params.fileId;
    
    if (!fileId) {
      return NextResponse.json({ message: 'File ID is required' }, { status: 400 });
    }

    logger.info('Processing document request', { fileId });

    // Find the file in the uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const files = await readdir(uploadsDir);
    
    // Find the file with the given fileId prefix
    const targetFile = files.find(file => file.startsWith(fileId));
    
    if (!targetFile) {
      logger.warn('File not found', { fileId, uploadsDir });
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    // Extract the original filename from the stored file
    const originalFileName = targetFile.substring(fileId.length + 1); // +1 for the hyphen
    
    // Create file URL accessible from the document server
    // Use the public URL of your Next.js app since that's what the document server needs to access
    const publicUrl = process.env.NEXTAUTH_URL || 'http://5.78.66.245:3000';
    const fileUrl = `${publicUrl}/uploads/${targetFile}`;

    logger.debug('File URL generated', { fileUrl, originalFile: originalFileName });

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
    logger.error('Error getting document', { error });
    
    return NextResponse.json(
      { message: `Failed to get document: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 