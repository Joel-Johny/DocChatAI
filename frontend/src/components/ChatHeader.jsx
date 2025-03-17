import React from "react";
import { ChevronLeft, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ChatHeader = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default ChatHeader;
