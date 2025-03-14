import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText } from 'lucide-react';

function Upload() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file?.type === 'application/pdf') {
      setIsLoading(true);
      // Simulate processing time
      setTimeout(() => {
        // Store the file in localStorage for demo purposes
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem('pdfFile', reader.result);
          setIsLoading(false);
          navigate('/chat');
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PDF Q&A</h1>
          <p className="text-gray-600">Upload your PDF and start asking questions</p>
        </div>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${isLoading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="text-gray-600">Processing your PDF...</p>
              </>
            ) : (
              <>
                {isDragActive ? (
                  <>
                    <FileText className="h-12 w-12 text-blue-500" />
                    <p className="text-blue-500">Drop your PDF here</p>
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-12 w-12 text-gray-400" />
                    <p className="text-gray-600">
                      Drag & drop your PDF here, or click to select
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;