import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createHash } from 'crypto';
import { logger } from '@/lib/logging';

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
    
    logger.info('Callback received from document server', { fileId, url: request.url });
    
    if (!fileId) {
      logger.error('Missing fileId in callback request');
      return NextResponse.json({ error: 1, message: 'File ID is required' });
    }
    
    // Parse the request body
    const body = await request.json();
    logger.debug('Callback body received', { body });
    
    // Check the status
    const status = body.status;
    if (!status) {
      logger.error('Missing status in callback request');
      return NextResponse.json({ error: 1, message: 'Status is required' });
    }
    
    // Check for the type of callback
    switch (status) {
      case 0: // = document is being edited
        logger.info('Document is being edited', { fileId });
        return NextResponse.json({ error: 0 });
        
      case 1: { // = document is ready for saving
        // Get the URL where the updated document is stored temporarily
        const url = body.url;
        
        if (!url) {
          logger.error('Missing URL in callback request for saving document');
          return NextResponse.json({ error: 1, message: 'URL is required for saving document' });
        }
        
        logger.info('Document ready for saving', { fileId, url });
        
        // Find the file in the uploads directory
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        
        try {
          // Download the updated file
          logger.debug('Attempting to download updated document', { url });
          const response = await fetch(url);
          
          if (!response.ok) {
            logger.error('Failed to fetch updated document from URL', { url, status: response.status, statusText: response.statusText });
            throw new Error(`Failed to download the updated document: ${response.statusText}`);
          }
          
          // Get the updated file as a buffer
          const fileBuffer = await response.arrayBuffer();
          logger.debug('Downloaded updated document', { size: fileBuffer.byteLength });
          
          // Find the existing file with the fileId prefix
          // In a real app, you'd use a database to track this
          const fs = require('fs');
          const files = fs.readdirSync(uploadsDir);
          const targetFile = files.find((file: string) => file.startsWith(fileId));
          
          if (!targetFile) {
            logger.error('Target file not found', { fileId, uploadsDir });
            return NextResponse.json({ error: 1, message: 'File not found' });
          }
          
          const filePath = join(uploadsDir, targetFile);
          logger.debug('Saving updated document', { filePath });
          
          // Save the updated file
          await writeFile(filePath, new Uint8Array(fileBuffer));
          logger.info('Document updated successfully', { fileId, filePath });
          
          return NextResponse.json({ error: 0, message: 'Document updated successfully' });
        } catch (error) {
          logger.error('Error saving document', { error });
          return NextResponse.json({ error: 1, message: `Error saving document: ${error instanceof Error ? error.message : 'Unknown error'}` });
        }
      }
        
      case 2: // = document has been edited but user has not prompted to save
        logger.info('Document edited but not saved', { fileId });
        return NextResponse.json({ error: 0 });
        
      case 3: // = document saving error
        logger.error('Error while saving document from document server', { body });
        return NextResponse.json({ error: 0 });
        
      case 4: // = document is closed with no changes
        logger.info('Document closed with no changes', { fileId });
        return NextResponse.json({ error: 0 });
        
      default:
        logger.warn('Unknown status in callback request', { status });
        return NextResponse.json({ error: 1, message: 'Unknown status' });
    }
  } catch (error) {
    logger.error('Error in ONLYOFFICE callback:', { error });
    return NextResponse.json({ 
      error: 1, 
      message: `Error processing callback: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
} 