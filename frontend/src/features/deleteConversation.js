import api from "../utils/axios"

export const deleteConversation = async (conversationId) => {
    try {
        await api.delete(`/api/chat/conversations/${conversationId}`)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
