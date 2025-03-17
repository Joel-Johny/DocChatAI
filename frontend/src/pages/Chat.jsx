import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";
import ChatInterface from "../components/ChatInterface";

function Chat() {
  const [pdfFile, setPdfFile] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const pdfViewerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPdf = localStorage.getItem("pdfFile");
    const storedDocumentId = localStorage.getItem("pdfDocumentId");
    if (!storedPdf || !storedDocumentId) {
      navigate("/");
      return;
    }
    setPdfFile(storedPdf);
    setDocumentId(storedDocumentId);
  }, [navigate]);

  const handleCitationClick = (page) => {
    if (pdfViewerRef.current) {
      pdfViewerRef.current.setPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Chat Section */}
      <div className="w-full md:w-1/2">
        <ChatInterface
          onCitationClick={handleCitationClick}
          documentId={documentId}
        />
      </div>

      {/* PDF Viewer Section */}
      <div className="hidden md:block w-1/2">
        <PDFViewer pdfFile={pdfFile} ref={pdfViewerRef} />
      </div>
    </div>
  );
}

export default Chat;
