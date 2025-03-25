Below is a high-level overview of how to install and integrate ONLYOFFICE’s Document Server into your Next.js app so that users can open, edit, and save .docx (and other Office) files directly in the browser, with their formatting intact. The setup requires you to run an instance of the ONLYOFFICE Document Server and then embed the editor in your Next.js frontend, typically via an iframe pointing to the Document Server. The Document Server handles the actual file editing and ensures fidelity to .docx.

1. Install/Run the ONLYOFFICE Document Server
   OnlyOffice Document Server is the core service that does the heavy lifting—rendering .docx files in an Office-like web interface, applying edits, and exporting them. You have multiple ways to set it up:

Option A: Docker (Recommended)
Install Docker on your machine or server if you haven’t already.

Pull the official OnlyOffice Document Server image:

bash
Copy
Edit
docker pull onlyoffice/documentserver
Run the container, exposing ports as needed (by default, port 80 inside the container):

bash
Copy
Edit
docker run -i -t -d -p 80:80 --name onlyoffice onlyoffice/documentserver
After it starts, ONLYOFFICE Document Server will be accessible at http://<your-server-ip>:80/.

Option B: Native Install (Ubuntu, etc.)
If you prefer not to use Docker, you can install the Document Server directly on Linux. The official docs provide installation instructions. The Docker approach, however, is simpler to manage and update.

2. Configure JWT for Secure Document Editing (Optional but Recommended)
   To secure the communication between your Next.js app and the Document Server, you can enable JSON Web Tokens (JWT). This ensures that only authorized parties can open or edit documents.

Set the JWT_SECRET environment variable inside your Document Server container or configuration:

bash
Copy
Edit
docker run -i -t -d \
 -p 80:80 \
 -e JWT_ENABLED=true \
 -e JWT_SECRET="yourStrongSecretKey" \
 --name onlyoffice \
 onlyoffice/documentserver
Enable the same JWT secret in your Next.js app’s configuration so you can sign the tokens you send to the Document Server.

3. Create an API Endpoint in Next.js to Provide File URLs
   The Document Server needs a publicly accessible URL for the file it will render and edit. Typically, you would:

Store the uploaded DOCX file somewhere (e.g., local server, AWS S3, etc.).

Provide a route in your Next.js backend that returns the file or a signed download URL so that Document Server can fetch it.

For example, you might create an endpoint like:

bash
Copy
Edit
POST /api/files/upload
This uploads the file from the user, stores it, then returns a file ID or public URL.

And another endpoint:

bash
Copy
Edit
GET /api/files/:id
This endpoint returns a publicly accessible link or a direct file stream for Document Server to load the file.

4. Embed the ONLYOFFICE Editor in Your Next.js Frontend
   You do not directly install the editor as a Node module; instead, you embed the editor in an <iframe> that points to your Document Server, passing in the necessary configuration parameters (file URL, JWT token, callbacks, etc.) in JavaScript.

Basic Steps:

Add a new page in Next.js, e.g. pages/edit/[fileId].tsx.

Fetch or generate the document editing configuration in getServerSideProps or a client-side call. The configuration includes:

The document URL (i.e., where Document Server fetches the file).

The editorConfig (permissions, callbacks, language, etc.).

The token (if JWT is enabled).

Render an iframe or a <div> that includes the JavaScript code to load the ONLYOFFICE editor. Typically, you do something like:

jsx
Copy
Edit
import { useEffect } from 'react';

export default function EditFile({ fileConfig }) {
useEffect(() => {
const { DocumentEditor } = window; // OnlyOffice editor global
if (DocumentEditor) {
// Init the doc editor
new DocumentEditor("placeholder-id", {
width: "100%",
height: "100%",
// all your config options:
document: {
fileType: "docx",
key: fileConfig.fileKey, // unique identifier for file version
title: "Resume.docx",
url: fileConfig.fileUrl,
},
editorConfig: {
// your editor config
},
// ...
});
}
}, []);

return (
<div
id="placeholder-id"
style={{ width: "100%", height: "80vh" }}
/>
);
}

export async function getServerSideProps(context) {
const { fileId } = context.query;

// 1) Fetch or generate the file’s URL, unique key, etc.
// 2) Return them in props for the React component
const fileConfig = {
fileUrl: `https://yourdomain.com/api/files/${fileId}`,
fileKey: 'some-random-unique-hash', // changes if the file updates
// ... any other needed info
};

return {
props: { fileConfig },
};
}
Note: The above code snippet is a simplified example. The official ONLYOFFICE Developer Guide shows the full configuration object you must pass to the editor.

Load the ONLYOFFICE front-end scripts. The Document Server provides JavaScript files you must include to create the editor instance. Typically, you’d do something like:

html
Copy
Edit

<script src="http://your-document-server/web-apps/apps/api/documents/api.js"></script>

This script might go in your \_document.js or \_app.js or loaded via a <Head> tag in Next.js, ensuring it is accessible globally. Make sure the URL points to your running Document Server instance.

5. Handling Save Callbacks
   When a user edits the document, ONLYOFFICE Document Server can call a callback URL that you specify in the editorConfig to send updates. You’ll need to:

Define a Next.js API route that receives these updates and writes them back to your storage.

In the editorConfig.callbackUrl, set it to your Next.js API endpoint. Example:

js
Copy
Edit
editorConfig: {
callbackUrl: "https://yourdomain.com/api/files/save-edits?fileId=XYZ",
// ...
}
Implement the logic in pages/api/files/save-edits.ts to:

Receive the data from the Document Server (often a link to the updated doc).

Download the updated file from the link.

Save it to your storage (database, S3 bucket, etc.).

6. Ensuring JWT Integration (If Enabled)
   If you enabled JWT in your Document Server container, you need to:

Sign the configuration object (e.g., doc URL, user info, callback URL) with the same secret.

Provide that token in the token field of the configuration you pass to the Document Editor.

The Document Server will verify the JWT. If it matches, it will allow editing; if not, it rejects the request.

For example:

js
Copy
Edit
import jwt from 'jsonwebtoken';

const secretKey = process.env.ONLYOFFICE_JWT_SECRET;

const fileConfig = {
document: { ... },
editorConfig: { ... },
// ...
};

// Sign it
const token = jwt.sign(fileConfig, secretKey);

// Then pass this token to the editor
You’ll also configure your Document Server to use JWT_ENABLED=true and the same JWT_SECRET.

7. Test Locally & Deploy
   Local Testing:

Spin up your Docker container with ONLYOFFICE Document Server on localhost:8080 (for example).

Run your Next.js app on localhost:3000.

Confirm you can load the editor, open a doc, and see the changes saved.

Deployment:

Deploy your Document Server (e.g., in a VPS or container platform).

Deploy your Next.js app (e.g., on Vercel, a Docker container in Hetzner, etc.).

Update the references in your Next.js app to point to the correct domain or IP of your Document Server.

Summary
Set up Document Server (Docker is easiest).

Provide your Next.js app with a way to store and serve files to the Document Server (file endpoint).

Embed the ONLYOFFICE editor by including the official scripts from the Document Server and instantiating new DocsAPI.DocEditor(...) or a similar class in your React code.

Set callback URLs for saving changes.

Use JWT if you want secure editing sessions.

With this flow in place, your users can upload DOCX files, open them in a browser-based editor with their original formatting, make changes, and then save the updated DOCX—without losing fidelity to the Word format.
