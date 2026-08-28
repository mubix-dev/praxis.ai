import api from "../utils/axios.js"

export const createConversation = async()=>{
    try {
        const {data} = await api.post("/api/chat/conversations")
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}