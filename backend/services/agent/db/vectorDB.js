import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
});

export const vectorStore = async (docs, collectionName) => {
  return await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: process.env.QDRANT_ENDPOINT,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: collectionName,
  });
};
