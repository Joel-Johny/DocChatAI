import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";
import ChatInterface from "../components/ChatInterface";

function Chat() {
  const [pdfFile, setPdfFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPdf = localStorage.getItem("pdfFile");
    const storedDocumentId = localStorage.getItem("pdfDocumentId");
    if (!storedPdf || !storedDocumentId) {
      navigate("/");
      return;
    }
    setPdfFile(storedPdf);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Chat Section */}
      <div className="w-full md:w-1/2">
        <ChatInterface setCurrentPage={setCurrentPage} />
      </div>

      {/* PDF Viewer Section */}
      <div className="hidden md:block w-1/2">
        <PDFViewer
          pdfFile={pdfFile}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Chat;
