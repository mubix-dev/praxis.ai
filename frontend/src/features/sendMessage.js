import api from "../utils/axios"
export const sendMessage = async(prompt,conversationId)=>{
    try {
        const {data} = await api.post("api/agent/chat",{prompt,conversationId})
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}