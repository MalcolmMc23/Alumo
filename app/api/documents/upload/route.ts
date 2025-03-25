import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Ensure the uploads directory exists
async function ensureUploadDirectory() {
  const uploadsDir = join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(uploadsDir, { recursive: true });
    return uploadsDir;
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    throw new Error('Failed to create uploads directory');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Check file type
    const supportedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.oasis.opendocument.text', // .odt
      'application/vnd.oasis.opendocument.spreadsheet', // .ods
      'application/vnd.oasis.opendocument.presentation' // .odp
    ];

    if (!supportedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Unsupported file type. Please upload a document file.' },
        { status: 400 }
      );
    }

    // Generate a unique file ID and create a safe filename
    const fileId = uuidv4();
    const originalName = file.name;
    const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${fileId}-${safeName}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = await ensureUploadDirectory();
    const filePath = join(uploadsDir, fileName);

    // Write the file to the server
    const fileArrayBuffer = await file.arrayBuffer();
    await writeFile(filePath, new Uint8Array(fileArrayBuffer));

    // Store file information in the database (in a real application)
    // For now, we're just returning the file ID and path
    return NextResponse.json({
      message: 'File uploaded successfully',
      fileId,
      fileName: originalName,
      filePath: `/uploads/${fileName}` // Public URL path
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 