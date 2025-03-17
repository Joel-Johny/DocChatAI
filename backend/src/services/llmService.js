const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_API_KEY); // Use API key from env

async function cleanModelOutput(response) {
  // Remove any "<think>" sections from the response
  return response.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}
const generateAnswer = async (question, relevantChunks) => {
  console.log("🔹 Generating Answer...");
  const context = relevantChunks.map((chunk) => chunk.text).join("\n");

  const messages = [
    {
      role: "system",
      content: `You are an AI assistant that provides **concise, precise, and to-the-point answers** based on the provided document. 
      You **cannot** generate code, modify PDFs, or answer general knowledge questions.
      If the question is unrelated to the document, respond with:
      "I can only answer questions based on the document provided."
      Keep answers **brief (2-3 sentences max)** while still being informative.`,
    },
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion: ${question}\nAnswer in **one or two sentences only**:`,
    },
  ];
  // console.log("Context:", context);
  // console.log("question:", question);
  try {
    const chatCompletion = await client.chatCompletion({
      model: "deepseek-ai/DeepSeek-R1", // Use a valid model
      messages: messages,
      provider: "novita",
      max_tokens: 200, // Further reduce token limit for brevity
    });

    const cleanedResponse = cleanModelOutput(
      chatCompletion.choices[0]?.message?.content
    );
    console.log("🔹 Answer:", cleanedResponse);
    return cleanedResponse || "No response from LLM.";
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    return "Couldn't generate an answer.";
  }
};

module.exports = { generateAnswer };
