import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter";

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
})

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
})

const openrouter = new ChatOpenRouter({
    model:"deepseek/deepseek-chat",
    temperature:0,
    maxTokens:2500
})

export const getllmModel = (agent)=>{
    switch (agent) {
        case "chat":
            return gemini; 
        case "search":
            return gemini;
        case "codeing":
            return openrouter;
        default:
            return gemini;
    }
}