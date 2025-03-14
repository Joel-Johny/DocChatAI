// src/controllers/pdfController.js
const path = require("path");

// This will be implemented in more detail in Issue 2
const askQuestion = async (req, res, next) => {
  try {
    // Basic implementation for now
    // For now, just return the question and answer as a response
    if (!req.body.question) {
      return res
        .status(400)
        .json({ error: true, message: "No question provided" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { askQuestion };
