import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileText, AlertCircle } from "lucide-react";
import axios from "axios";

function Upload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    // Clear any previous errors
    setError("");

    if (!file) return;

    if (file.type === "application/pdf") {
      setIsLoading(true);

      try {
        // Store PDF in localStorage (original functionality)
        const reader = new FileReader();
        reader.onload = async () => {
          // Store the PDF data in localStorage
          localStorage.setItem("pdfFile", reader.result);

          try {
            const formData = new FormData();
            formData.append("pdf", file);

            const backendUrl =
              import.meta.env.VITE_API_URL || "http://localhost:5000";
            const uploadEndpoint = `${backendUrl}/api/pdf/upload`;

            const response = await axios.post(uploadEndpoint, formData);

            const documentId = response.data.documentId; // Adjust based on your API response structure

            localStorage.setItem("pdfDocumentId", documentId);
          } catch (uploadError) {
            console.error("Error uploading to server:", uploadError);
          }

          // Navigate to chat page (original functionality)
          setIsLoading(false);
          navigate("/chat");
        };

        // Start reading the file as Data URL
        reader.readAsDataURL(file);

        reader.onerror = () => {
          setIsLoading(false);
          setError("Failed to read the PDF file. Please try again.");
        };
      } catch (error) {
        console.error("Error handling PDF:", error);
        setIsLoading(false);
        setError("Failed to process the PDF. Please try again.");
      }
    } else {
      // Handle invalid file type
      setError("Please upload a valid PDF file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Document Mind
          </h1>
          <p className="text-gray-600">
            Upload your PDF and start asking questions
          </p>
        </div>

        <div className="relative group">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isLoading}
          />
          <div
            className={`
            border-2 border-dashed border-gray-300 rounded-lg p-8 
            transition-all duration-200 group-hover:border-blue-500
            ${isLoading ? "opacity-50" : ""}
          `}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  <p className="text-gray-600">Processing your PDF...</p>
                </>
              ) : (
                <>
                  <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors duration-200">
                    <UploadIcon className="h-10 w-10 text-gray-500 group-hover:text-blue-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      Upload PDF
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click or drag and drop your PDF here
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
