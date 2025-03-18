# DocChatAI

DocChatAI is an intelligent document interaction platform that allows users to upload PDF documents and engage in meaningful conversations about their content. By leveraging RAG (Retrieval-Augmented Generation) technology, users can extract insights, ask questions, and navigate seamlessly through their documents.

## Features

- **PDF Upload & Management**: Easily upload and organize your PDF documents
- **AI-Powered Chat**: Have natural conversations about your document content
- **Smart Citations**: Get referenced page numbers with each response
- **Interactive Viewer**: Built-in PDF viewer with jump-to-page functionality
- **Performance Optimized**: Designed to handle large documents efficiently

## Technology Stack

- **Frontend**: React with Tailwind CSS for responsive design
- **Backend**: Node.js with Express
- **Document Processing**: LamaParse for PDF parsing, LangChain for text chunking
- **Vector Store**: MongoDB Atlas with vector search capabilities
- **Embeddings**: Xenova Transformers for generating document embeddings
- **LLM Integration**: Hugging Face for text generation
- **RAG Implementation**: Optimized for sending only the most relevant context chunks to the LLM

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account with vector search enabled

### Installation

1. Clone the repository

```bash
git clone https://github.com/Joel-Johny/DocChatAI.git
cd DocChatAI
```

2. Install dependencies for both frontend and backend

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Set up environment variables:

   **Backend (.env file in the backend directory)**

   ```
   PORT=5000
   LLAMA_CLOUD_API_KEY=your_llama_cloud_api_key
   LLAMA_CLOUD_PARSING_URL=https://your_llama_cloud_parsing_url
   MONGODB_ATLAS_DB_NAME=document_mind
   MONGODB_ATLAS_COLLECTION_NAME=vector
   MONGODB_ATLAS_URI=your_mongodb_connection_string
   HF_API_KEY=your_huggingface_api_key
   ```

   **Frontend (.env file in the frontend directory)**

   ```
   VITE_API_URL=BACKEND URL
   ```

4. MongoDB Setup

   - Create a vector index named `vector_index` in your MongoDB Atlas cluster under your configured db->collection with the following configuration:

   ```json
   {
     "fields": [
       {
         "numDimensions": 384,
         "path": "embedding",
         "similarity": "cosine",
         "type": "vector"
       },
       {
         "path": "documentId",
         "type": "filter"
       }
     ]
   }
   ```

5. Start the development servers

```bash
# Start backend (from the backend directory)
npm run dev

# Start frontend (from the frontend directory)
npm start
```

6. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload a PDF**: Click "Upload" to add a new document
2. **Review the Document**: View the PDF in the integrated viewer
3. **Start a Conversation**: Ask questions about the document in the chat panel
4. **Follow Citations**: Click on page references to jump to specific sections

## Demo

A live demo of the application is available at [document-mind.vercel.app](https://document-mind.vercel.app)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Created by [Joel Johny](https://github.com/Joel-Johny)
