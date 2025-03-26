import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

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
 * Generate a JWT token for ONLYOFFICE Document Server
 */
export const generateDocumentJWT = (config: DocumentConfig): string => {
  const jwtSecret = process.env.ONLYOFFICE_JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('ONLYOFFICE_JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(config, jwtSecret, { algorithm: 'HS256', expiresIn: '1h' });
};

/**
 * Generate a unique document key for the ONLYOFFICE editor
 */
export const generateDocumentKey = (fileId: string): string => {
  return `${fileId}-${Date.now()}`;
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

  const config: DocumentConfig = {
    document: {
      fileType: fileExtension,
      key: generateDocumentKey(fileId),
      title: fileName,
      url: fileUrl,
    },
    documentType,
    editorConfig: {
      callbackUrl: process.env.ONLYOFFICE_CALLBACK_URL || `http://5.78.66.245:3000/api/documents/callback?fileId=${fileId}`,
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
    throw new Error('NEXT_PUBLIC_ONLYOFFICE_DOCUMENT_SERVER_URL is not defined in environment variables');
  }

  // Ensure the URL doesn't end with a slash before appending the path
  const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
  return `${baseUrl}/web-apps/apps/api/documents/api.js`;
}; 