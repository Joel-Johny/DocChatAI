// src/controllers/pdfController.js
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  uploadPdfToLlamaParse,
  checkParsingStatus,
  getParsedMarkdown,
} = require("../services/llamaParseService");

const uploadAndProcessPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "No PDF file uploaded" });
    }

    const filePath = req.file.path;
    const documentId = uuidv4(); // Generate a unique ID for this document

    // Step 1: Upload to LlamaParse
    const uploadResponse = await uploadPdfToLlamaParse(filePath);
    const jobId = uploadResponse.job_id;

    // Step 2: Poll for job completion (in a real app, you might want to use a queue or webhook)
    let statusResponse;
    let isComplete = false;

    // Simple polling implementation - in production, use a proper job queue
    while (!isComplete) {
      statusResponse = await checkParsingStatus(jobId);
      isComplete = statusResponse.status === "COMPLETED";

      if (statusResponse.status === "FAILED") {
        throw new Error("Parsing job failed");
      }

      if (!isComplete) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before checking again
      }
    }

    // Step 3: Get the parsed markdown content
    const parsedContent = await getParsedMarkdown(jobId);
    // TODO: In the next step, we'll add code to process this with LlamaIndex and store in Chroma DB

    // Clean up the temporary file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "PDF processed successfully",
      documentId: documentId,
      jobId: jobId,
      // We're returning this for now, but in production we wouldn't
      contentPreview: parsedContent.substring(0, 200) + "...",
    });
  } catch (error) {
    // Clean up the file if it exists and there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

module.exports = { uploadAndProcessPdf };
