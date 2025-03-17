import React from "react";
import { Loader } from "lucide-react";

const Thinking = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white border shadow-sm rounded-lg p-4 max-w-[80%] flex items-center">
        <Loader className="h-5 w-5 text-blue-500 animate-spin mr-3" />
        <p className="text-gray-500">Thinking...</p>
      </div>
    </div>
  );
};

export default Thinking;
