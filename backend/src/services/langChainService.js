const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const convertToVector = async (text) => {
  try {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      throw new Error("Invalid text for embedding.");
    }

    const { pipeline } = await import("@xenova/transformers");
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    const vector = await embedder(text, { pooling: "mean", normalize: true });

    return Array.isArray(vector.data)
      ? vector.data
      : Object.values(vector.data);
  } catch (error) {
    console.error("Error converting text to vector:", error);
    throw error;
  }
};

const vectorizeChunks = async (chunks) => {
  try {
    const vectors = [];

    for (const chunk of chunks) {
      const vectorArray = await convertToVector(chunk);
      vectors.push({ text: chunk, vector: vectorArray });
    }

    return vectors;
  } catch (error) {
    console.error("Error during vectorization:", error);
    throw error;
  }
};

const determineChunkSize = (textLength) => {
  if (textLength < 1000) return { chunkSize: 256, chunkOverlap: 30 }; // ~12% overlap
  if (textLength < 5000) return { chunkSize: 512, chunkOverlap: 60 }; // ~12% overlap
  if (textLength < 15000) return { chunkSize: 768, chunkOverlap: 100 }; // ~13% overlap
  if (textLength < 30000) return { chunkSize: 1024, chunkOverlap: 150 }; // ~15% overlap
  return { chunkSize: 2048, chunkOverlap: 300 }; // ~15% overlap
};

async function chunkText(parsedText) {
  // Step 1: Ensure parsedContent is a string
  if (
    !parsedText ||
    typeof parsedText !== "string" ||
    parsedText.trim().length === 0
  ) {
    throw new Error("Parsed content is empty or invalid.");
  }

  console.log("Parsed Text Length:", parsedText.length); // Debugging
  const { chunkSize, chunkOverlap } = determineChunkSize(parsedText.length);

  // Step 2: Chunk using RecursiveCharacterTextSplitter
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize,
    chunkOverlap,
  });
  const chunks = await splitter.splitText(parsedText);
  console.log("🔹 Total Chunks Created:", chunks.length);
  // console.log("🔹 First Chunk:", chunks[0]);

  return chunks;
}

module.exports = { vectorizeChunks, chunkText, convertToVector };
