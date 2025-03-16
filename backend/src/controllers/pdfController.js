// src/controllers/pdfController.js
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  uploadPdfToLlamaParse,
  checkParsingStatus,
  getParsedMarkdown,
} = require("../services/llamaParseService");
const { vectorizeChunks, chunkText } = require("../services/langChainService"); // Import from LangChain service
const { saveVectors } = require("../services/mongoDBVectorService");
const uploadAndProcessPdf = async (req, res, next) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "No PDF file uploaded" });
    }

    // Get the path of the uploaded file
    const filePath = req.file.path;
    // Generate a unique ID for this document
    const documentId = uuidv4();
    // Get the original filename for metadata
    const originalFilename = req.file.originalname;

    console.log(`Processing file: ${originalFilename}`);
    console.log(`Assigned document ID: ${documentId}`);

    // Step 1: Upload to LlamaParse
    console.log("Uploading to LlamaParse...");
    const uploadResponse = await uploadPdfToLlamaParse(filePath);
    const jobId = uploadResponse.id;
    console.log(`LlamaParse job created with ID: ${jobId}`);

    // Step 2: Poll for job completion
    let statusResponse;
    let isComplete = false;
    console.log("Checking LlamaParse processing status...");

    // Keep checking until the job is complete
    while (!isComplete) {
      // Get current status
      statusResponse = await checkParsingStatus(jobId);
      console.log(`Current status: ${statusResponse.status}`);

      // Check if job is complete
      isComplete = statusResponse.status === "SUCCESS";

      // Handle failed jobs
      if (statusResponse.status === "FAILED") {
        throw new Error("Parsing job failed");
      }

      // If not complete, wait before checking again
      if (!isComplete) {
        console.log("Waiting for processing to complete...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    // Step 3: Get the parsed markdown content
    console.log("Retrieving parsed content...");
    const parsedContent = await getParsedMarkdown(jobId);
    console.log(
      `Retrieved parsed content (${parsedContent?.markdown?.length} characters)`
    );

    // Step 4: Convert parsed content to vector embeddings using LangChain
    console.log("Converting to vector embeddings using xenova...");

    // Process the content with LangChain
    const parsedContentMarkdown = parsedContent?.markdown;
    const chunks = await chunkText(parsedContentMarkdown);
    const vectorizationResult = await vectorizeChunks(chunks);
    // console.log(vectorizationResult);
    const result = await saveVectors(vectorizationResult, documentId);
    // Return success response with detailed information
    return res.status(200).json({
      success: true,
      message: "PDF processed and vectorized successfully",
      documentId: documentId,
      chunksLength: chunks.length,
      result,
    });
  } catch (error) {
    // Log and pass error to error handler
    console.error("Error processing PDF:", error);
    next(error);
  } finally {
    // Clean up the temporary file regardless of success/failure
    if (req.file && fs.existsSync(req.file.path)) {
      console.log(`Cleaning up temporary file: ${req.file.path}`);
      fs.unlinkSync(req.file.path);
    }
  }
};

module.exports = { uploadAndProcessPdf };
