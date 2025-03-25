import DocumentUploadForm from "@/components/DocumentUploadForm";

export const metadata = {
  title: "Document Editor",
  description: "Edit Office documents online with ONLYOFFICE",
};

export default function DocumentsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Document Editor</h1>

      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload a Document</h2>
          <p className="text-gray-500 mb-6">
            Upload your document to edit it in the browser. Supported formats
            include .docx, .xlsx, .pptx, and other Office formats.
          </p>

          <DocumentUploadForm />
        </div>
      </div>
    </div>
  );
}
