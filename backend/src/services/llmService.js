const axios = require("axios");

const generateAnswer = async (question, relevantChunks) => {
  const context = relevantChunks.map((chunk) => chunk.text).join("\n");

  // **System Prompt (LLM Instruction)**
  const systemPrompt = `
  You are an AI assistant designed to answer questions **only related to the provided document**. 
  You **cannot** generate code, modify PDFs, or answer general knowledge questions. 
  If the question is unrelated to the document, respond with: 
  "I can only answer questions based on the document provided."
  `;

  // **User Prompt (Question & Context)**
  const userPrompt = `Context:\n${context}\n\nQuestion: ${question}\nAnswer:`;

  const payload = {
    inputs: `${systemPrompt}\n\n${userPrompt}`,
    parameters: { max_length: 300 },
  };

  console.log("Sending payload to Hugging Face:");

  try {
    const response = await axios.post(process.env.HF_LLM_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return response.data[0]?.generated_text || "No response from LLM.";
  } catch (error) {
    console.error(
      "Hugging Face API Error:",
      error.response?.data || error.message
    );
    return "Couldn't generate an answer.";
  }
};

module.exports = { generateAnswer };
