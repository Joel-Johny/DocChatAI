const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const dotenv = require("dotenv");
dotenv.config();

// Create Axios instance for LlamaParse API
const LLAMA_PARSING_API = axios.create({
  baseURL: process.env.LLAMA_CLOUD_PARSING_URL,
});

// Automatically attach Authorization token to every request
LLAMA_PARSING_API.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.LLAMA_CLOUD_API_KEY}`;
  return config;
});

// Function to upload PDF to LlamaParse
const uploadPdfToLlamaParse = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await LLAMA_PARSING_API.post("/upload", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error uploading to LlamaParse: ${error.message}`);
  }
};

// Function to check the status of a parsing job
const checkParsingStatus = async (jobId) => {
  try {
    // console.log(jobId);
    const response = await LLAMA_PARSING_API.get(`/job/${jobId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error checking parsing status: ${error.message}`);
  }
};

// Function to get the parsed result in Markdown
const getParsedMarkdown = async (jobId) => {
  try {
    const response = await LLAMA_PARSING_API.get(
      `/job/${jobId}/result/markdown`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error getting parsed markdown: ${error.message}`);
  }
};

module.exports = {
  uploadPdfToLlamaParse,
  checkParsingStatus,
  getParsedMarkdown,
};
