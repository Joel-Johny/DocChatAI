const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const vectorizeChunks = async (chunks) => {
  try {
    const { pipeline } = await import("@xenova/transformers");

    // Load the embedding model
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    // M1 Processes chunks in small concurrent batches to balance performance with embedding consistency.
    // const vectors = await Promise.all(
    //   chunks.map(async (chunk, index) => {
    //     const vector = await embedder(chunk, {
    //       pooling: "mean",
    //       normalize: true,
    //     });

    //     // Convert vector.data to an array if necessary
    //     const vectorArray = Array.isArray(vector.data)
    //       ? vector.data
    //       : Object.values(vector.data);

    //     return {
    //       text: chunk, // Original chunk text
    //       vector: vectorArray, // Embedding array
    //     };
    //   })
    // );
    // M2 Sequentially processes each chunk one at a time to ensure consistent embedding generation.
    const vectors = [];
    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index];
      const vector = await embedder(chunk, {
        pooling: "mean",
        normalize: true,
      });
      // Ensure the vector data is in array format
      const vectorArray = Array.isArray(vector.data)
        ? vector.data
        : Object.values(vector.data);

      vectors.push({
        text: chunk,
        vector: vectorArray,
      });
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

module.exports = { vectorizeChunks, chunkText };
