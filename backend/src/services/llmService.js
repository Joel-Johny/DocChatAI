const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_API_KEY); // Use API key from env

async function cleanModelOutput(response) {
  // Remove any "<think>" sections from the response
  return response.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}
const generateAnswer = async (question, relevantChunks) => {
  console.log("🔹 Generating Answer...");

  // Create context with page numbers included
  const context = relevantChunks
    .map((chunk) => `[Page ${chunk.page}] ${chunk.text}`)
    .join("\n\n");

  const messages = [
    {
      role: "system",
      content: `You are an AI assistant that provides concise, precise, and to-the-point answers based on the provided document.
      You cannot generate code, modify PDFs, or answer general knowledge questions.
      If the question is unrelated to the document, respond with:
      "I can only answer questions based on the document provided."
      
      IMPORTANT FORMATTING INSTRUCTION: 
      When answering, provide your complete answer first. Then, at the very end of your response, 
      include the page numbers where you found the information using the format {{page X}} 
      where X is the page number.
      
      DO NOT include page references in the middle of sentences or statements.
      
      Example of CORRECT formatting:
      "The project started in 2020 and had a budget of $500,000. {{page 5}}"
      
      Example of INCORRECT formatting:
      "The project started in 2020 {{page 5}} and had a budget of $500,000 {{page 6}}."
      
      Keep answers brief (2-3 sentences max) while still being informative.`,
    },
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion: ${question}\nAnswer in one or two sentences only, with page references at the END using {{page X}} format:`,
    },
  ];

  try {
    const chatCompletion = await client.chatCompletion({
      model: "deepseek-ai/DeepSeek-R1",
      messages: messages,
      provider: "novita",
      max_tokens: 200,
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

function extractAndRemovePageNumbers(text) {
  const regex = /\{\{page (\d+)\}\}/g; // Matches {{page X}}
  const pageNumbers = [...text.matchAll(regex)].map((match) =>
    parseInt(match[1], 10)
  );

  // Remove all occurrences of {{page X}} from the text
  const answer = text.replace(regex, "").replace(/\s+/g, " ").trim();

  return { pageNumbers, answer };
}
module.exports = { generateAnswer, extractAndRemovePageNumbers };
