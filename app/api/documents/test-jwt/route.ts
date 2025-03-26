import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { logger } from '@/lib/logging';
import { validateOnlyOfficeEnvironment } from '@/lib/documents/documentUtils';

export async function GET() {
  try {
    // Validate environment before proceeding
    if (!validateOnlyOfficeEnvironment()) {
      return NextResponse.json({ 
        success: false, 
        message: 'ONLYOFFICE environment validation failed' 
      }, { status: 500 });
    }
    
    const jwtSecret = process.env.ONLYOFFICE_JWT_SECRET;
    
    // Create a test payload
    const payload = {
      test: true,
      timestamp: Date.now()
    };
    
    // Sign with same secret and algorithm
    const token = jwt.sign(payload, jwtSecret!, { algorithm: 'HS256' });
    
    // Verify it can be decoded properly
    const decoded = jwt.verify(token, jwtSecret!);
    
    logger.info('JWT test successful', { decoded });
    
    return NextResponse.json({ 
      success: true, 
      message: 'JWT authentication verified successfully'
    });
  } catch (error) {
    logger.error('JWT test failed', { error });
    
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 