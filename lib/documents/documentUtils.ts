import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/lib/logging';

// Types
export interface DocumentConfig {
  document: {
    fileType: string;
    key: string;
    title: string;
    url: string;
  };
  documentType: string;
  editorConfig: {
    callbackUrl: string;
    lang: string;
    mode: string;
    user: {
      id: string;
      name: string;
    };
  };
}

/**
 * Validate ONLYOFFICE environment variables are correctly set
 */
export const validateOnlyOfficeEnvironment = (): boolean => {
  const requiredVars = [
    'NEXT_PUBLIC_ONLYOFFICE_DOCUMENT_SERVER_URL',
    'ONLYOFFICE_JWT_SECRET',
    'ONLYOFFICE_CALLBACK_URL'
  ];
  
  let isValid = true;
  const errors: string[] = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      isValid = false;
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });
  
  // Validate JWT secret length and format
  const jwtSecret = process.env.ONLYOFFICE_JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    isValid = false;
    errors.push('ONLYOFFICE_JWT_SECRET is too short (should be at least 32 characters)');
  }
  
  // Validate server URL format
  const serverUrl = process.env.NEXT_PUBLIC_ONLYOFFICE_DOCUMENT_SERVER_URL;
  if (serverUrl && !serverUrl.startsWith('http')) {
    isValid = false;
    errors.push('NEXT_PUBLIC_ONLYOFFICE_DOCUMENT_SERVER_URL must start with http:// or https://');
  }
  
  if (!isValid) {
    logger.error('ONLYOFFICE environment validation failed:', errors);
  } else {
    logger.info('ONLYOFFICE environment validation passed');
  }
  
  return isValid;
};

/**
 * Generate a JWT token for ONLYOFFICE Document Server
 */
export const generateDocumentJWT = (config: DocumentConfig): string => {
  const jwtSecret = process.env.ONLYOFFICE_JWT_SECRET;
  
  if (!jwtSecret) {
    logger.error('ONLYOFFICE_JWT_SECRET is not defined');
    throw new Error('ONLYOFFICE_JWT_SECRET is not defined in environment variables');
  }

  logger.debug('Generating JWT token', { 
    secretLength: jwtSecret.length,
    documentKey: config.document.key
  });
  
  try {
    // Add required header for ONLYOFFICE JWT
    const payload = {
      ...config,
      iss: 'Alumo',
      aud: 'ONLYOFFICE'
    };
    
    // Make sure we're using the correct algorithm that ONLYOFFICE expects
    const token = jwt.sign(payload, jwtSecret, { 
      algorithm: 'HS256',
      expiresIn: '5h',
      header: {
        alg: 'HS256',
        typ: 'JWT'
      }
    });
    logger.info('JWT Token generated successfully');
    return token;
  } catch (error) {
    logger.error('Error generating JWT token', { error });
    throw error;
  }
};

/**
 * Generate a unique document key for the ONLYOFFICE editor
 */
export const generateDocumentKey = (fileId: string): string => {
  // Use a combination of fileId and random UUID for uniqueness
  return `${fileId}-${uuidv4()}`;
};

/**
 * Create editor configuration for a document
 */
export const createEditorConfig = (
  fileId: string,
  fileName: string,
  fileUrl: string,
  userId: string,
  userName: string
): DocumentConfig => {
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  let documentType = 'word';
  
  // Determine document type based on extension
  if (['xlsx', 'xls', 'ods'].includes(fileExtension)) {
    documentType = 'cell';
  } else if (['pptx', 'ppt', 'odp'].includes(fileExtension)) {
    documentType = 'slide';
  }

  logger.debug('Creating editor config', { fileId, fileName, documentType });

  // Construct callback URL with the file ID
  const baseCallbackUrl = process.env.ONLYOFFICE_CALLBACK_URL || process.env.NEXTAUTH_URL;
  
  if (!baseCallbackUrl) {
    logger.error('Missing callback URL configuration');
    throw new Error('Either ONLYOFFICE_CALLBACK_URL or NEXTAUTH_URL must be defined');
  }
  
  // Check if the baseCallbackUrl already includes the callback path
  const hasCallbackPath = baseCallbackUrl.includes('/api/documents/callback');
  
  // Make sure URL doesn't end with a slash
  const trimmedCallbackUrl = baseCallbackUrl.endsWith('/') 
    ? baseCallbackUrl.slice(0, -1) 
    : baseCallbackUrl;
  
  // Ensure path is correctly formatted with fileId - if URL already has the path, don't add it again
  const callbackUrl = hasCallbackPath 
    ? `${trimmedCallbackUrl}?fileId=${fileId}` 
    : `${trimmedCallbackUrl}/api/documents/callback?fileId=${fileId}`;
  
  logger.debug('Callback URL generated', { callbackUrl });

  const config: DocumentConfig = {
    document: {
      fileType: fileExtension,
      key: generateDocumentKey(fileId),
      title: fileName,
      url: fileUrl,
    },
    documentType,
    editorConfig: {
      callbackUrl: callbackUrl,
      lang: 'en',
      mode: 'edit',
      user: {
        id: userId,
        name: userName,
      },
    },
  };

  return config;
};

/**
 * Get the ONLYOFFICE Document Server API URL
 */
export const getDocumentServerUrl = (): string => {
  const serverUrl = process.env.NEXT_PUBLIC_ONLYOFFICE_DOCUMENT_SERVER_URL;
  
  if (!serverUrl) {
    logger.error('NEXT_PUBLIC_ONLYOFFICE_DOCUMENT_SERVER_URL is not defined');
    throw new Error('NEXT_PUBLIC_ONLYOFFICE_DOCUMENT_SERVER_URL is not defined in environment variables');
  }

  // Ensure the URL doesn't end with a slash before appending the path
  const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
  const apiUrl = `${baseUrl}/web-apps/apps/api/documents/api.js`;
  
  logger.debug('Using Document Server API URL', { apiUrl });
  return apiUrl;
}; 