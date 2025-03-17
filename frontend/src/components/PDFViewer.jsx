import { useState } from "react";
import { Document, Page } from "react-pdf";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PDFViewer({ pdfFile, currentPage, setCurrentPage }) {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, numPages || 1));
  };

  return (
    <div className="h-screen bg-gray-100 overflow-auto">
      {pdfFile && (
        <div className="flex flex-col items-center py-8">
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex flex-col items-center"
          >
            <Page
              pageNumber={currentPage}
              className="mb-4"
              width={Math.min(window.innerWidth * 0.45, 800)}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>

          {/* Page Navigation */}
          <div className="flex items-center gap-4 mt-4 bg-white rounded-lg shadow px-4 py-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage <= 1
                  ? "text-gray-300"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {numPages || 1}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage >= (numPages || 1)}
              className={`p-2 rounded-lg transition-colors ${
                currentPage >= (numPages || 1)
                  ? "text-gray-300"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PDFViewer;
