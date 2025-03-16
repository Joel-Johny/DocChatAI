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
    //       id: `chunk_${index}`, // Unique ID for each chunk
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
        id: `chunk_${index}`,
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
  // console.log("🔹 First Chunk:", chunks[0]);

  return chunks;
}

module.exports = { vectorizeChunks, chunkText };
