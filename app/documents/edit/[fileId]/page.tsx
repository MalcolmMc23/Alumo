"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DocumentEditor from "@/components/DocumentEditor";
import { Button } from "@/components/ui/button";

interface EditorConfig {
  config: any;
  token: string;
}

export default function EditDocumentPage({
  params,
}: {
  params: { fileId: string };
}) {
  const router = useRouter();
  const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch document configuration
    const fetchDocumentConfig = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/documents/${params.fileId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load document");
        }

        const data = await response.json();
        setEditorConfig(data);
      } catch (error) {
        setError(
          `Error loading document: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentConfig();
  }, [params.fileId]);

  const handleBack = () => {
    router.push("/documents");
  };

  return (
    <div className="container mx-auto py-4">
      <div className="mb-4 flex items-center">
        <Button variant="outline" onClick={handleBack} className="mr-4">
          &larr; Back to Documents
        </Button>
        <h1 className="text-2xl font-bold">
          {editorConfig?.config?.document?.title || "Document Editor"}
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading document...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <Button className="mt-4" onClick={handleBack}>
            Back to Documents
          </Button>
        </div>
      ) : editorConfig ? (
        <div
          className="bg-white rounded-lg shadow-md overflow-hidden"
          style={{ height: "calc(100vh - 10rem)" }}
        >
          <DocumentEditor
            config={editorConfig.config}
            token={editorConfig.token}
          />
        </div>
      ) : null}
    </div>
  );
}
