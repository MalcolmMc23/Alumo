import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createHash } from 'crypto';

// Promisify the pipeline function
const pipelineAsync = promisify(pipeline);

/**
 * Handle callbacks from ONLYOFFICE Document Server
 * Documentation: https://api.onlyoffice.com/editors/callback
 */
export async function POST(request: NextRequest) {
  try {
    // Get the fileId from the query params
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    
    if (!fileId) {
      return NextResponse.json({ error: 1, message: 'File ID is required' });
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Check the status
    const status = body.status;
    if (!status) {
      return NextResponse.json({ error: 1, message: 'Status is required' });
    }
    
    // Check for the type of callback
    switch (status) {
      case 0: // = document is being edited
        return NextResponse.json({ error: 0 });
        
      case 1: { // = document is ready for saving
        // Get the URL where the updated document is stored temporarily
        const url = body.url;
        
        if (!url) {
          return NextResponse.json({ error: 1, message: 'URL is required for saving document' });
        }
        
        // Find the file in the uploads directory
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        
        // Download the updated file
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to download the updated document: ${response.statusText}`);
        }
        
        // Get the updated file as a buffer
        const fileBuffer = await response.arrayBuffer();
        
        // Find the existing file with the fileId prefix
        // In a real app, you'd use a database to track this
        const fs = require('fs');
        const files = fs.readdirSync(uploadsDir);
        const targetFile = files.find((file: string) => file.startsWith(fileId));
        
        if (!targetFile) {
          return NextResponse.json({ error: 1, message: 'File not found' });
        }
        
        const filePath = join(uploadsDir, targetFile);
        
        // Save the updated file
        await writeFile(filePath, new Uint8Array(fileBuffer));
        
        return NextResponse.json({ error: 0, message: 'Document updated successfully' });
      }
        
      case 2: // = document has been edited but user has not prompted to save
        return NextResponse.json({ error: 0 });
        
      case 3: // = document saving error
        console.error('Error while saving document', body);
        return NextResponse.json({ error: 0 });
        
      case 4: // = document is closed with no changes
        return NextResponse.json({ error: 0 });
        
      default:
        return NextResponse.json({ error: 1, message: 'Unknown status' });
    }
  } catch (error) {
    console.error('Error in ONLYOFFICE callback:', error);
    return NextResponse.json({ 
      error: 1, 
      message: `Error processing callback: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
} 