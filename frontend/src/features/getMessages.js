import { useDispatch } from "react-redux"
import api from "../utils/axios"
export const getMessages = async (conversationId)=>{
    try {
        const {data} = await api.get(`/api/chat/conversations/${conversationId}/messages`)
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}