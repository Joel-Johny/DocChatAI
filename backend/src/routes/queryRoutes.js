// src/routes/queryRoutes.js
const express = require("express");
const router = express.Router();
const queryController = require("../controllers/queryController");

// Route for querying a document
router.post("/ask", queryController.askQuestion);

module.exports = router;
