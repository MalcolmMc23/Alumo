import { useEffect, useRef, useState } from "react";
import { getDocumentServerUrl } from "@/lib/documents/documentUtils";
import { Button } from "./ui/button";

interface DocumentEditorProps {
  config: any;
  token: string;
}

declare global {
  interface Window {
    DocsAPI?: any;
  }
}

export default function DocumentEditor({ config, token }: DocumentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>("");
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [jwtStatus, setJwtStatus] = useState<string | null>(null);

  // Function to ping the ONLYOFFICE Document Server
  const pingDocumentServer = async () => {
    try {
      // Extract the base part of the API URL
      const baseUrl = apiUrl.split("/web-apps")[0];
      const pingUrl = `${baseUrl}/healthcheck`;

      setPingStatus("Testing connection...");
      const response = await fetch(pingUrl, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
      });

      if (response.ok) {
        setPingStatus(
          `Server is responding: ${response.status} ${response.statusText}`
        );
      } else {
        setPingStatus(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
    } catch (err) {
      setPingStatus(
        `Connection failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  // Function to test JWT authentication
  const testJwtAuthentication = async () => {
    try {
      setJwtStatus("Testing JWT authentication...");

      // Call our test endpoint
      const response = await fetch("/api/documents/test-jwt", {
        method: "GET",
        cache: "no-cache",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setJwtStatus("JWT authentication successful ✓");
      } else {
        setJwtStatus(`JWT authentication failed: ${data.message}`);
      }
    } catch (err) {
      setJwtStatus(
        `JWT test failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  useEffect(() => {
    // Load ONLYOFFICE Document Server API script
    const loadDocumentServerAPI = () => {
      try {
        const apiScriptUrl = getDocumentServerUrl();
        setApiUrl(apiScriptUrl); // Store the URL for debugging

        console.log("Loading ONLYOFFICE API from:", apiScriptUrl);

        const script = document.createElement("script");
        script.src = apiScriptUrl;
        script.async = true;
        script.onload = () => {
          console.log("ONLYOFFICE API script loaded successfully");
          setIsLoaded(true);
        };
        script.onerror = (e) => {
          console.error("Failed to load ONLYOFFICE API:", e);
          setError(
            "Failed to load ONLYOFFICE Document Server API. Please check your server configuration."
          );

          // Try to ping the server when the API fails to load
          pingDocumentServer();
        };
        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      } catch (err) {
        console.error("Error loading Document Server API:", err);
        setError(
          `Error loading Document Server API: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    };

    loadDocumentServerAPI();
  }, []);

  useEffect(() => {
    // Initialize editor once API is loaded
    let docEditor: any = null;

    if (isLoaded && window.DocsAPI && editorRef.current && config) {
      try {
        const editorConfig = { ...config };

        // Add token if provided
        if (token) {
          editorConfig.token = token;
        }

        docEditor = new window.DocsAPI.DocEditor(
          "document-editor",
          editorConfig
        );
      } catch (err) {
        setError(
          `Error initializing editor: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    }

    return () => {
      if (docEditor && docEditor.destroyEditor) {
        docEditor.destroyEditor();
      }
    };
  }, [isLoaded, config, token]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        {apiUrl && (
          <div className="mt-2 text-sm">
            <p>Attempted to load API from: {apiUrl}</p>
            <p className="mt-1">
              Make sure the ONLYOFFICE Document Server is running and accessible
              at {apiUrl.split("/web-apps")[0]}.
            </p>
            <div className="mt-3 space-y-2">
              {pingStatus ? (
                <p className="text-sm text-gray-700">{pingStatus}</p>
              ) : (
                <Button
                  onClick={pingDocumentServer}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Test Connection
                </Button>
              )}

              {jwtStatus ? (
                <p className="text-sm text-gray-700">{jwtStatus}</p>
              ) : (
                <Button
                  onClick={testJwtAuthentication}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Test JWT Auth
                </Button>
              )}
            </div>
            <div className="mt-3 p-3 bg-gray-100 rounded">
              <p className="font-semibold">Troubleshooting Steps:</p>
              <ol className="list-decimal ml-5 mt-2 text-gray-700">
                <li>
                  Check if ONLYOFFICE container is running:{" "}
                  <code>sudo docker ps | grep onlyoffice</code>
                </li>
                <li>
                  Verify if port 8080 is accessible on your server:{" "}
                  <code>curl -I http://localhost:8080</code>
                </li>
                <li>
                  Check if any firewall is blocking port 8080:{" "}
                  <code>sudo ufw status</code>
                </li>
                <li>
                  Verify JWT is configured in the container:{" "}
                  <code>
                    sudo docker exec onlyoffice bash -c "grep JWT
                    /etc/onlyoffice/documentserver/default.json"
                  </code>
                </li>
                <li>
                  Restart the ONLYOFFICE container:{" "}
                  <code>sudo docker restart onlyoffice</code>
                </li>
                <li>
                  Or restart with proper JWT configuration using Docker Compose:{" "}
                  <code>cd /path/to/project && sudo docker-compose up -d</code>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {!isLoaded && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading document editor...</span>
        </div>
      )}
      <div
        id="document-editor"
        ref={editorRef}
        className="w-full h-full"
        style={{ display: isLoaded ? "block" : "none", minHeight: "80vh" }}
      ></div>
    </div>
  );
}
