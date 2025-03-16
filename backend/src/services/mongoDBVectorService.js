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

      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await client.connect();
      console.log("Connected to MongoDB Atlas");

      const dbName = process.env.MONGODB_ATLAS_DB_NAME || "document_mind";
      const collectionName =
        process.env.MONGODB_ATLAS_COLLECTION_NAME || "vectors";

      const db = client.db(dbName);
      collection = db.collection(collectionName);
    } catch (error) {
      console.error("Error connecting to MongoDB Atlas:", error);
      throw error;
    }
  }
  return collection;
};

/**
 * Close the MongoDB Atlas connection.
 */
const closeDB = async () => {
  if (client) {
    await client.close();
    console.log("MongoDB Atlas connection closed");
    client = null;
    collection = null;
  }
};

const saveVectors = async (vectors, documentId) => {
  try {
    const mongoCollection = await connectDB();

    // Map your vector objects to the desired document format.
    // Note: We store the vector in the field "embedding" to match our Atlas index.
    const operations = vectors.map((v) => ({
      updateOne: {
        filter: { id: v.id, documentId }, // Ensure uniqueness per document
        update: {
          $set: {
            id: v.id,
            documentId,
            text: v.text,
            embedding: v.vector, // Save the vector under "embedding"
          },
        },
        upsert: true,
      },
    }));

    const result = await mongoCollection.bulkWrite(operations);
    console.log(
      `Successfully stored ${vectors.length} vectors for document ${documentId}`
    );
    return result;
  } catch (error) {
    console.error("Error saving vectors to MongoDB Atlas:", error);
    throw error;
  }
};

module.exports = {
  connectDB,
  closeDB,
  saveVectors,
};
