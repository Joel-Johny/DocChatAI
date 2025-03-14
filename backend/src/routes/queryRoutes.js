// src/routes/queryRoutes.js
const express = require("express");
const router = express.Router();
const { askQuestion } = require("../controllers/queryController");

// Route for querying a document
router.post("/ask", askQuestion);

module.exports = router;
