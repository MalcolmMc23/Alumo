# ONLYOFFICE Document Server Integration

This application integrates with ONLYOFFICE Document Server to provide in-browser editing of Office documents (.docx, .xlsx, .pptx, etc.) with full formatting preservation.

## Setup Instructions

### 1. Install and Run ONLYOFFICE Document Server

The easiest way to run ONLYOFFICE Document Server is using Docker:

```bash
# Pull the official ONLYOFFICE Document Server image
docker pull onlyoffice/documentserver

# Run the container with JWT security enabled
docker run -i -t -d -p 8080:80 \
  -e JWT_ENABLED=true \
  -e JWT_SECRET="yourStrongSecretKey" \
  --name onlyoffice \
  onlyoffice/documentserver
```

Make sure to use the same JWT secret as specified in your `.env` file.

### 2. Configure Environment Variables

Make sure your `.env` file includes the following variables:

```
# ONLYOFFICE Document Server Configuration
NEXT_PUBLIC_ONLYOFFICE_DOCUMENT_SERVER_URL=http://localhost:8080
ONLYOFFICE_JWT_SECRET=yourStrongSecretKey
ONLYOFFICE_CALLBACK_URL=http://localhost:3000/api/documents/callback
```

### 3. Run the Application

Start your Next.js application:

```bash
npm run dev
```

### 4. Usage

1. Navigate to the Documents page
2. Upload a document (.docx, .xlsx, .pptx, etc.)
3. The document will open in the ONLYOFFICE editor
4. Make changes and they will be automatically saved when you click the save button

## How It Works

1. **File Upload**: Users upload documents to the server.
2. **Document Editor**: The ONLYOFFICE Document Server renders the document in the browser.
3. **JWT Security**: All communication between the Next.js app and ONLYOFFICE Document Server is secured with JWT tokens.
4. **Callbacks**: When users save a document, ONLYOFFICE Document Server sends a callback to the Next.js app with the updated document.

## Files Structure

- `/app/documents` - Document pages
- `/app/api/documents` - API endpoints for document operations
- `/components/DocumentEditor.tsx` - Component that embeds the ONLYOFFICE editor
- `/components/DocumentUploadForm.tsx` - Form for uploading documents
- `/lib/documents/documentUtils.ts` - Utilities for document operations

## Troubleshooting

- If you have issues with the ONLYOFFICE Document Server, check the Docker logs:

  ```bash
  docker logs onlyoffice
  ```

- Make sure the ONLYOFFICE Document Server can access your Next.js app's callback URL. If running locally, you might need to use a service like ngrok to expose your local server.

- Check that the JWT secrets match between your Next.js app and the ONLYOFFICE Document Server.

## References

- [ONLYOFFICE Document Server API Documentation](https://api.onlyoffice.com/editors/basic)
- [ONLYOFFICE Document Server GitHub](https://github.com/ONLYOFFICE/DocumentServer)
