import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { Send, ChevronLeft, ChevronRight, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Chat() {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPdf = localStorage.getItem('pdfFile');
    if (!storedPdf) {
      navigate('/');
      return;
    }
    setPdfFile(storedPdf);
  }, [navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: input }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'This is a simulated AI response. In a real implementation, this would be connected to your backend API.',
        citations: [{ page: 1, text: 'Sample citation' }]
      }]);
    }, 1000);

    setInput('');
  };

  const handleCitationClick = (page) => {
    setCurrentPage(page);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage(page => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(page => Math.min(page + 1, numPages || 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Chat Section */}
      <div className="w-full md:w-1/2 flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 border-b bg-white flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 hover:bg-gray-100 p-2 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <Book className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-xl font-semibold">PDF Q&A Chat</h1>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border'
                }`}
              >
                <p>{message.content}</p>
                {message.citations && (
                  <div className="mt-2 text-sm">
                    {message.citations.map((citation, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCitationClick(citation.page)}
                        className="text-blue-200 hover:text-blue-100 underline"
                      >
                        Page {citation.page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your PDF..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* PDF Viewer Section */}
      <div className="hidden md:block w-1/2 h-screen bg-gray-100 overflow-auto">
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
                    ? 'text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100'
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
                    ? 'text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;