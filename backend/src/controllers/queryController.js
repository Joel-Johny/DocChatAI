const { convertToVector } = require("../services/langchainService");
// const { findRelevantChunks } = require("../services/vectorSearchService");

const askQuestion = async (req, res, next) => {
  try {
    const question = req.body.question;
    if (!question) {
      return res
        .status(400)
        .json({ error: true, message: "No question provided" });
    }

    // Step 1: Convert question to a vector
    // const queryVector = await convertToVector(question);

    // Step 2: Find relevant document chunks using vector search
    // const relevantChunks = await findRelevantChunks(queryVector);

    // Step 3: Return the retrieved answer (for now, just returning chunks)
    res.status(200).json({ question, answer: "ss" });
  } catch (error) {
    next(error);
  }
};

module.exports = { askQuestion };
