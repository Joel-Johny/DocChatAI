import { Info } from "lucide-react";

function LoadingInfoMessage() {
  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start">
      <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-blue-700">
        <p>Longer PDFs may take more time to process. Please Wait....</p>
        <p className="mt-1">Maximum file size: 10 MB</p>
        <p className="mt-1">
          I am using Render free tier so please be patient.
        </p>
      </div>
    </div>
  );
}

export default LoadingInfoMessage;
