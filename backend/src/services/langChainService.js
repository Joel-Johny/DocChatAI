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
    // console.log("🔹 Converting text to vector...");
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
  console.log("🔹 Vectorizing Chunks...");
  try {
    const vectors = [];

    for (const chunk of chunks) {
      const vectorArray = await convertToVector(chunk.text);
      vectors.push({ text: chunk.text, vector: vectorArray, page: chunk.page });
    }
    console.log(`✅ Successfully vectorized ${vectors.length} chunks`);
    return vectors;
  } catch (error) {
    console.error("Error during vectorization:", error);
    throw error;
  }
};
async function chunkText(parsedText) {
  if (
    !parsedText ||
    typeof parsedText !== "string" ||
    parsedText.trim().length === 0
  ) {
    throw new Error("Parsed content is empty or invalid.");
  }

  console.log("Parsed Text Length:", parsedText.length);

  // Step 1: Split text by `---` to separate pages
  const pages = parsedText.split(/\n\s*---\s*\n/); // Split only when `---` is on its own line
  console.log(`🔹 Total Pages Detected: ${pages.length}`);

  const chunkSize = 512; // Fixed chunk size
  const chunkOverlap = 100; // Fixed chunk overlap

  let allChunks = [];

  for (let i = 0; i < pages.length; i++) {
    const pageText = pages[i].trim();
    if (!pageText) continue; // Skip empty pages

    console.log(`🔹 Processing Page ${i + 1} (Length: ${pageText.length})`);

    // Step 2: Apply RecursiveCharacterTextSplitter with fixed settings
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize,
      chunkOverlap,
    });

    const chunks = await splitter.splitText(pageText);

    // Step 3: Attach page number to each chunk
    const chunksWithPageNumbers = chunks.map((chunk) => ({
      text: chunk,
      page: i + 1, // Page numbers start from 1
    }));

    allChunks.push(...chunksWithPageNumbers);
  }

  console.log("🔹 Total Chunks Created:", allChunks.length);
  return allChunks;
}

module.exports = { vectorizeChunks, chunkText, convertToVector };
