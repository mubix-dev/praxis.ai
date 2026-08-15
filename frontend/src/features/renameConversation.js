import api from "../utils/axios"

export const renameConversation = async (conversationId, title) => {
    try {
        await api.patch(`/api/chat/conversations/${conversationId}`, { title })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
