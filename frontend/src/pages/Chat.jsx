import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";
import ChatInterface from "../components/ChatInterface";

function Chat() {
  const [pdfFile, setPdfFile] = useState(null);
  const pdfViewerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPdf = localStorage.getItem("pdfFile");
    if (!storedPdf) {
      navigate("/");
      return;
    }
    setPdfFile(storedPdf);
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
        <ChatInterface onCitationClick={handleCitationClick} />
      </div>

      {/* PDF Viewer Section */}
      <div className="hidden md:block w-1/2">
        <PDFViewer pdfFile={pdfFile} ref={pdfViewerRef} />
      </div>
    </div>
  );
}

export default Chat;
