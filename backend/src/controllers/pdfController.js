// src/controllers/pdfController.js
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  uploadPdfToLlamaParse,
  checkParsingStatus,
  getParsedMarkdown,
} = require("../config/llamaParseService");

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
    // console.log("upload response:", uploadResponse); //{ id: 'b8f0fe1f-06b0-4379-a133-ea2696d947b9', status: 'PENDING' }
    const jobId = uploadResponse.id;

    // Step 2: Poll for job completion (in a real app, you might want to use a queue or webhook)
    let statusResponse;
    let isComplete = false;

    // Simple polling implementation - in production, use a proper job queue
    while (!isComplete) {
      statusResponse = await checkParsingStatus(jobId);
      // console.log("Status response:", statusResponse);

      isComplete = statusResponse.status === "SUCCESS"; //Status response: { id: 'f5d2f40d-b2f1-4520-8471-39b6de86c081', status: 'PENDING' }

      if (statusResponse.status === "FAILED") {
        throw new Error("Parsing job failed");
      }

      if (!isComplete) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before checking again
      }
    }

    // Step 3: Get the parsed markdown content
    const parsedContent = await getParsedMarkdown(jobId);
    // console.log("parsed content:", parsedContent);
    // TODO: In the next step, we'll add code to process this with LlamaIndex and store in Chroma DB

    return res.status(200).json({
      success: true,
      message: "PDF processed successfully",
      documentId: documentId,
      jobId: jobId,
      // We're returning this for now, but in production we wouldn't
      contentPreview: parsedContent,
    });
  } catch (error) {
    next(error);
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

module.exports = { uploadAndProcessPdf };
