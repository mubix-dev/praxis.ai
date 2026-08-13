import { getllmModel } from "../utils/llm.models"

export const chatAgent = async (state)=>{
    const llm = getllmModel("chat")
    const sysPrompt = "You are PraxisAI an AI intelligent assistant"

    const response = await llm.invoke([
        {
            role:"system",
            content:sysPrompt
        },
        {
            role:"human",
            content:state.prompt
        }
    ])

    return {
        ...state,
        aiResponse:response.content
    }
}