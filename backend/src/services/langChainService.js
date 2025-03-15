const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const vectorizeChunks = async (chunks) => {
  try {
    parsedContent = parsedContent?.markdown;
    console.log("🔹 Got the Chunks", chunks);

    console.log(`✅ Successfully chunked text into ${chunks.length} chunks.`);
    console.log(`✅ Successfully chunked text into ${chunks} chunks.`);
    return {};
  } catch (error) {
    console.error(
      `❌ Error converting document ${documentId} to vectors:`,
      error
    );
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
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", ". ", " "], // Ensures better sentence-based splitting
  });
  const chunks = await splitter.splitText(parsedText);
  console.log("🔹 Total Chunks Created:", chunks.length);
  console.log("🔹 First Chunk:", chunks[0]);

  return chunks;
}

module.exports = { vectorizeChunks, chunkText };
