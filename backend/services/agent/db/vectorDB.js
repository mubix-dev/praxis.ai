import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-004", 
});

export const vectorStore = async (docs,collectionName) => {
  return  await QdrantVectorStore.fromExistingCollection(
    docs,
    embeddings,
    {
      url: process.env.QDRANT_URL,
      collectionName: collectionName,
    },
  );
};
