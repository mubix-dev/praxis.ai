import api from "../utils/axios.js"

export const getALLConversations = async()=>{
    try {
        const {data} = await api.get("/api/chat/conversations")
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}