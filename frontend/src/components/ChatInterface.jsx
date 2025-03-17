import { useState, useRef, useEffect } from "react";
import { Send, ChevronLeft, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ChatInterface({ onCitationClick }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: "user", content: input }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content:
            "This is a simulated AI response. In a real implementation, this would be connected to your backend API.",
          citations: [{ page: 1, text: "Sample citation" }],
        },
      ]);
    }, 1000);

    setInput("");
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
        className="flex-1 overflow-y-auto p-4 space-y-4"
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
                  : "bg-white border"
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
  );
}

export default ChatInterface;
