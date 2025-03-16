const { convertToVector } = require("../services/langchainService");
const { queryVectorDB } = require("../services/mongoDBVectorService");

const askQuestion = async (req, res, next) => {
  try {
    const question = req.body.question;
    const documentId = req.body.documentId;
    if (!question || !documentId) {
      return res
        .status(400)
        .json({ error: true, message: "No question or documentId provided" });
    }

    // Step 1: Convert question to a vector
    const queryVector = await convertToVector(question);

    // Step 2: Find relevant document chunks using vector search
    const relevantChunks = await queryVectorDB(queryVector, documentId);

    // Step 3: Return the retrieved answer (for now, just returning chunks)
    res.status(200).json({ question, relevantChunks });
  } catch (error) {
    next(error);
  }
};

module.exports = { askQuestion };
