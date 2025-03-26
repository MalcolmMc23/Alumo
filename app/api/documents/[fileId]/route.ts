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
    
    // Create file URL using host.docker.internal for Docker containers
    // Fall back to the server's public IP for external clients
    const serverHost = process.env.ENABLE_DOCKER_HOST === 'true' 
      ? 'host.docker.internal' 
      : '5.78.66.245'; // Your server's public IP
    const fileUrl = `http://${serverHost}:3000/uploads/${targetFile}`;

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