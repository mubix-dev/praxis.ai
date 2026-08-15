import api from "../utils/axios"
export const sendMessage = async(prompt,conversationId,agent)=>{
    try {
        const {data} = await api.post("api/agent/chat",{prompt,conversationId,agent})
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}