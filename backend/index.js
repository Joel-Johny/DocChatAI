const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Import routes
const pdfRoutes = require("./src/routes/pdfRoutes");
const queryRoutes = require("./src/routes/queryRoutes");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use("/api/pdf", pdfRoutes);
app.use("/api/query", queryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: err.message || "Something went wrong on the server",
  });
});

// Start server
app.get("/", (req, res) => res.send("Hello from the backend! get data"));
app.post("/test-post", (req, res) =>
  res.send("Hello from the backend! post data")
);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
