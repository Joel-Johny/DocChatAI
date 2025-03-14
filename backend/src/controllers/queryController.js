// src/controllers/pdfController.js
const path = require("path");

// This will be implemented in more detail in Issue 2
const uploadAndProcessPdf = async (req, res, next) => {
  try {
    // Basic implementation for now
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "No PDF file uploaded" });
    }

    // For now, just return the file info
    // In Issue 2, we'll add the actual processing with LlamaParse and LlamaIndex
    return res.status(200).json({
      success: true,
      message: "PDF received successfully",
      documentId: path.parse(req.file.filename).name, // Using filename without extension as temp ID
      fileInfo: req.file,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadAndProcessPdf };
