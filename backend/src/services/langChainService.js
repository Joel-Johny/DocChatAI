const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const vectorizeChunks = async (chunks) => {
  try {
    const { pipeline } = await import("@xenova/transformers");

    // Load the free embedding model
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    // Generate embeddings for each chunk
    const vectors = await Promise.all(
      chunks.map(async (chunk, index) => {
        const vector = await embedder(chunk, {
          pooling: "mean",
          normalize: true,
        });

        return {
          id: `chunk_${index}`, // Assign a unique ID to each chunk
          text: chunk, // Store the original chunk text
          vector: vector.data, // Use Xenova vector output
        };
      })
    );

    return vectors;
  } catch (error) {
    console.error(`❌ Error converting document chunks to vectors:`, error);
    throw error;
  }
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

  // Step 2: Chunk using RecursiveCharacterTextSplitter
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize: 512,
    chunkOverlap: 50,
  });
  const chunks = await splitter.splitText(parsedText);
  console.log("🔹 Total Chunks Created:", chunks.length);
  console.log("🔹 First Chunk:", chunks[0]);

  return chunks;
}

module.exports = { vectorizeChunks, chunkText };
