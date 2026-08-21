import api from "../utils/axios"
export const sendMessage = async(prompt,conversationId,agent)=>{
    try {
        const {data} = await api.post("api/agent/chat",{prompt,conversationId,agent})
        return data
    } catch (error) {
        console.log(error)
        return { error: error?.response?.data?.message || "request_failed" }
    }
}