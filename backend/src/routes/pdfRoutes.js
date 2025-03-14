// src/routes/pdfRoutes.js
const express = require("express");
const router = express.Router();
const { uploadAndProcessPdf } = require("../controllers/pdfController");
const upload = require("../middleware/uploadMiddleware");

// Route for uploading and processing a PDF
router.post("/upload", upload.single("pdf"), uploadAndProcessPdf);

module.exports = router;
