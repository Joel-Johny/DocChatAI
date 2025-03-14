// src/config/config.js
const { ChromaClient } = require("chromadb");

// Initialize Chroma client
const initChromaClient = async () => {
  try {
    // For local development, ChromaDB can be started in-memory
    const client = new ChromaClient({
      path: process.env.CHROMA_DB_PATH || "http://localhost:8000",
    });

    // Test connection
    await client.heartbeat();
    console.log("Connected to ChromaDB successfully");
    return client;
  } catch (error) {
    console.error("Failed to connect to ChromaDB:", error);
    throw error;
  }
};

module.exports = {
  initChromaClient,
};
