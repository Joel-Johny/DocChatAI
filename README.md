# DocChatAI

DocChatAI is an intelligent document interaction platform that allows users to upload PDF documents and engage in meaningful conversations about their content. By leveraging AI technology, users can extract insights, ask questions, and navigate seamlessly through their documents.

## Features

- **PDF Upload & Management**: Easily upload and organize your PDF documents
- **AI-Powered Chat**: Have natural conversations about your document content
- **Smart Citations**: Get referenced page numbers with each response
- **Interactive Viewer**: Built-in PDF viewer with jump-to-page functionality
- **Performance Optimized**: Designed to handle large documents efficiently

## Technology Stack

- **Frontend**: React with Tailwind CSS for responsive design
- **Backend**: Node.js with Express
- **Document Processing**: PDF parsing and vectorization for intelligent retrieval
- **AI Integration**: Advanced natural language processing capabilities

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Joel-Johny/DocChatAI.git
cd DocChatAI
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables by creating a `.env` file in the server directory

4. Start the development servers
```bash
# Start backend (from the server directory)
npm run dev

# Start frontend (from the client directory)
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Upload a PDF**: Click "Upload" to add a new document
2. **Review the Document**: View the PDF in the integrated viewer
3. **Start a Conversation**: Ask questions about the document in the chat panel
4. **Follow Citations**: Click on page references to jump to specific sections

## Demo

A live demo of the application is available at [docchatlive.netlify.app](https://docchatlive.netlify.app)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Created by [Joel Johny](https://github.com/Joel-Johny)
