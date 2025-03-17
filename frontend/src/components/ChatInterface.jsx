import { useState, useRef, useEffect } from "react";
import { Send, ChevronLeft, Book, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Thinking from "./Thinking";

function ChatInterface({ onCitationClick }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  // Add greeting message when component mounts
  useEffect(() => {
    // Add initial greeting message
    setMessages([
      {
        type: "ai",
        content:
          "Hello! I'm ready to help. Ask me anything about your document.",
        isGreeting: true,
      },
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: input }]);

    // Clear input and set loading state
    const userQuestion = input;
    setInput("");
    setIsLoading(true);

    try {
      // Get document ID from localStorage
      const documentId = localStorage.getItem("pdfDocumentId");

      // Prepare request data
      const requestData = {
        question: userQuestion,
        documentId: documentId,
      };

      // Get API URL from environment variables
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const queryEndpoint = `${backendUrl}/api/query/ask`;

      // Make API request
      const response = await axios.post(queryEndpoint, requestData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Process the response
      const aiResponse = response.data;

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content:
            aiResponse.answer || "I couldn't find an answer to that question.",
          citations: aiResponse.citations || [],
        },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content:
            "Sorry, I encountered an error while processing your question. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = (page) => {
    if (onCitationClick) {
      onCitationClick(page);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center">
        <button
          onClick={() => {
            localStorage.removeItem("pdfFile");
            localStorage.removeItem("pdfDocumentId");
            navigate("/");
          }}
          className="mr-4 hover:bg-gray-100 p-2 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center">
          <Book className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-xl font-semibold">Document Mind</h1>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white border shadow-sm"
              } ${message.isGreeting ? "border-blue-200 bg-blue-50" : ""}
                ${
                  message.isError ? "border-red-200 bg-red-50 text-red-700" : ""
                }`}
            >
              <p>{message.content}</p>
              {message.citations && message.citations.length > 0 && (
                <div className="mt-2 text-sm">
                  {message.citations.map((citation, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCitationClick(citation.page)}
                      className="text-blue-200 hover:text-blue-100 underline mr-2"
                    >
                      Page {citation.page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator when waiting for response */}
        {isLoading && <Thinking />}
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
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading || !input.trim()
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInterface;
