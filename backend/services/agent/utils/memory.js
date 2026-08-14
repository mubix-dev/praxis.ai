import redis from "../../../shared/redis/redis.js"
import { getMessages } from "./getMessages.js"

const TTL = 24 * 60 * 60

export const getMemory = async (conversationId) => {
    try {
        const key = `messages-${conversationId}`
        const cached = await redis.get(key)

        if (cached) {
            return JSON.parse(cached)
        }

        const messages = (await getMessages(conversationId)) || []
        const trimmed = messages.slice(-20)
        await redis.set(key, JSON.stringify(trimmed), "EX", TTL)

        return trimmed
    } catch (error) {
        console.log("getMemory error:", error.message)
        return []                    
    }
}

export const addMessage = async (conversationId, role, content) => {
    try {
        const key = `messages-${conversationId}`
        const cached = await redis.get(key)          
        const messages = cached ? JSON.parse(cached) : []

        messages.push({ role, content })

        await redis.set(key, JSON.stringify(messages.slice(-20)), "EX", TTL)
    } catch (error) {
        console.log("addMessage error:", error.message)  
    }
}
