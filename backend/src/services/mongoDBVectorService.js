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

const saveVectors = async (vectors, documentId) => {
  try {
    const mongoCollection = await connectDB(); // Use the shared connection

    const documents = vectors.map((vector) => ({
      documentId,
      text: vector.text,
      embedding: vector.vector, // Store vectors under "embedding" (to match MongoDB index)
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

    const mongoCollection = await connectDB(); // Use the shared connection

    const results = await mongoCollection
      .aggregate([
        {
          $match: { documentId }, // Filter by documentId first
        },
        {
          $vectorSearch: {
            index: "vector_index", // Your MongoDB Atlas Vector Index name
            path: "embedding", // Field where embeddings are stored
            queryVector: queryVector,
            numCandidates: 100, // Candidates to consider
            limit: 5, // Return top 5 similar results
            metric: "cosine", // Use cosine similarity (since we normalized embeddings)
          },
        },
      ])
      .toArray();

    console.log("🔍 Top matching documents:", results);
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
