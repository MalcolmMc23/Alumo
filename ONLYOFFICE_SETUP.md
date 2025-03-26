# ONLYOFFICE Document Server Integration Guide

This guide explains how to properly set up and maintain the ONLYOFFICE Document Server integration with the Alumo application.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ and npm
- Alumo Next.js application running

## Setting Up ONLYOFFICE Document Server

### Using Docker Compose (Recommended)

1. Make sure the `docker-compose.yml` file is in your project root (this was added as part of this setup)
2. Run the following command to start the Document Server:

```bash
# Navigate to your project directory
cd /path/to/alumo

# Start ONLYOFFICE Document Server
sudo docker-compose up -d
```

3. Verify it's running correctly:

```bash
sudo docker-compose ps
```

You should see the `onlyoffice` container running and healthy.

### Manual Docker Setup (Alternative)

If you prefer not to use Docker Compose, you can run the container directly:

```bash
sudo docker run -i -t -d \
  -p 8080:80 \
  -e JWT_ENABLED=true \
  -e JWT_SECRET=25b0a22503790aaa3ec6a34e6463728c464f51d4dabf8fcdc3c967eb2cbc9bad \
  --name onlyoffice \
  -v onlyoffice_data:/var/www/onlyoffice/Data \
  -v onlyoffice_log:/var/log/onlyoffice \
  onlyoffice/documentserver
```

## Environment Configuration

Make sure the following environment variables are correctly set in your `.env` file:

```
NEXT_PUBLIC_ONLYOFFICE_DOCUMENT_SERVER_URL=http://5.78.66.245:8080
ONLYOFFICE_JWT_SECRET=25b0a22503790aaa3ec6a34e6463728c464f51d4dabf8fcdc3c967eb2cbc9bad
ONLYOFFICE_CALLBACK_URL=http://host.docker.internal:3000/api/documents/callback
ENABLE_DOCKER_HOST=true
```

**Important**: The JWT secret in your `.env` file MUST match exactly the JWT_SECRET set in the Docker container.

## Testing the Integration

The application includes built-in testing tools for the ONLYOFFICE integration:

1. If you encounter document security token errors, click the "Test JWT Auth" button to verify JWT authentication is working
2. Use the "Test Connection" button to verify the Document Server is accessible
3. Check for errors in the server logs (both Next.js and ONLYOFFICE containers)

## Troubleshooting Common Issues

### "Document Security Token" Errors

If you see "The document security token is not correctly formed":

1. **Check JWT Configuration**: Make sure your JWT secret in the .env file matches what's in the Docker container
2. **Restart ONLYOFFICE Container**:
   ```bash
   sudo docker restart onlyoffice
   ```
   OR
   ```bash
   sudo docker-compose restart onlyoffice
   ```
3. **Verify JWT is Enabled**:
   ```bash
   sudo docker exec onlyoffice bash -c "grep JWT /etc/onlyoffice/documentserver/default.json"
   ```
   You should see JWT is enabled and the secret matches your .env file

### Connection Issues

If the document server can't be reached:

1. **Check Docker Status**:
   ```bash
   sudo docker ps | grep onlyoffice
   ```
2. **Verify Port Access**:
   ```bash
   curl -I http://localhost:8080
   ```
3. **Check Firewall**:
   ```bash
   sudo ufw status
   ```
   Make sure port 8080 is allowed if you're using a firewall

### File Access Issues

If documents can't be loaded:

1. Ensure your `uploadsDir` exists: `/path/to/alumo/public/uploads`
2. Check file permissions on uploaded files
3. Verify the URL format in the environment variables

## Maintenance

### Updates

To update the ONLYOFFICE Document Server:

```bash
sudo docker-compose pull
sudo docker-compose up -d
```

### Backup

The Docker Compose setup includes volumes for data persistence. To back them up:

```bash
sudo docker run --rm --volumes-from onlyoffice -v $(pwd):/backup alpine tar cvf /backup/onlyoffice-data.tar /var/www/onlyoffice/Data
```

## Environment Validation

The application now includes automatic environment validation that runs when the document API is called. This validation checks:

1. Required environment variables are set
2. JWT secret is of sufficient length and properly formatted
3. Server URL is valid

If the validation fails, check the server logs for details on what needs to be corrected.
