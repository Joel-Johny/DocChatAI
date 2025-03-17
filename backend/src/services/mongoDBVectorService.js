// mongoDBVectorService.js
const { MongoClient } = require("mongodb");

let client;
let collection;

const connectDB = async () => {
  if (!client) {
    try {
      const uri = process.env.MONGODB_ATLAS_URI;
      if (!uri) {
        throw new Error("MongoDB Atlas URI not found in environment variables");
      }

      client = new MongoClient(uri);

      await client.connect();
      console.log("✅ Connected to MongoDB Atlas");

      const dbName = process.env.MONGODB_ATLAS_DB_NAME || "document_mind";
      const collectionName =
        process.env.MONGODB_ATLAS_COLLECTION_NAME || "vectors";

      const db = client.db(dbName);
      collection = db.collection(collectionName);
    } catch (error) {
      console.error("❌ Error connecting to MongoDB Atlas:", error);
      throw error;
    }
  }
  return collection;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log("✅ MongoDB Atlas connection closed");
    client = null;
    collection = null;
  }
};

const saveVectors = async (vectorizedChunks, documentId) => {
  try {
    console.log("🔹 Saving Vectors...");
    const mongoCollection = await connectDB(); // Use the shared connection
    const documents = vectorizedChunks.map((chunk) => ({
      documentId,
      text: chunk.text,
      page: chunk.page,
      embedding: chunk.vector, // Store vectors under "embedding" (to match MongoDB index)
    }));

    const result = await mongoCollection.insertMany(documents);
    console.log(`✅ Successfully stored ${result.insertedCount} vectors`);

    return result;
  } catch (error) {
    console.error("❌ Error saving vectors:", error);
    throw error;
  }
};

const queryVectorDB = async (queryVector, documentId) => {
  try {
    if (!Array.isArray(queryVector)) {
      throw new Error("Invalid query vector format.");
    }
    console.log("🔹 Querying Vector DB...");
    const mongoCollection = await connectDB(); // Use the shared connection

    const results = await mongoCollection
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index", // Your MongoDB Atlas Vector Index name
            path: "embedding", // Field where embeddings are stored
            queryVector, // Query against precomputed vector
            numCandidates: 100, // Consider top 100 candidates
            limit: 5, // Return top 5 matches
            metric: "cosine", // Use cosine similarity
            filter: { documentId }, // Move filtering inside $vectorSearch
          },
        },
      ])
      .toArray();

    console.log("🔍 Top matching documents found");
    return results;
  } catch (error) {
    console.error("❌ Error during vector search:", error);
    throw error;
  }
};

module.exports = {
  connectDB,
  closeDB,
  saveVectors,
  queryVectorDB,
};
