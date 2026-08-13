import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
})


const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
})

export const getllmModel = (agent)=>{
    switch (agent) {
        case "chat":
            return gemini;
    
        default:
            return gemini;
    }
}