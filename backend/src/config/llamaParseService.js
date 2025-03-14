// src/services/llamaParseService.js
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
require("dotenv").config();

// Function to upload PDF to LlamaParse
const uploadPdfToLlamaParse = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      process.env.LLAMA_CLOUD_PARSING_URL + "/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${LLAMA_CLOUD_API_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Error uploading to LlamaParse: ${error.message}`);
  }
};

// Function to check the status of a parsing job
const checkParsingStatus = async (jobId) => {
  try {
    const response = await axios.get(
      process.env.LLAMA_CLOUD_PARSING_URL + `/job/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${LLAMA_CLOUD_API_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Error checking parsing status: ${error.message}`);
  }
};

// Function to get the parsed result in Markdown
const getParsedMarkdown = async (jobId) => {
  try {
    const response = await axios.get(
      process.env.LLAMA_CLOUD_PARSING_URL + `/job/${jobId}/result/markdown`,
      {
        headers: {
          Authorization: `Bearer ${LLAMA_CLOUD_API_KEY}`,
        },
      }
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
