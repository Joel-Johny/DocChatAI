import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import Upload from './pages/Upload';
import Chat from './pages/Chat';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;