import api from "../utils/axios"
export const sendMessage = async(prompt,conversationId,agent,file)=>{
    try {
        let payload = { prompt, conversationId, agent }

        if (file) {
            payload = new FormData()
            payload.append("prompt", prompt)
            payload.append("conversationId", conversationId)
            payload.append("agent", agent)
            payload.append("file", file)
        }

        const {data} = await api.post("api/agent/chat", payload)
        return data
    } catch (error) {
        console.log(error)
        return { error: error?.response?.data?.message || "request_failed" }
    }
}
