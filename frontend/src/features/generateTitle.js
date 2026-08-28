import api from "../utils/axios"
export const generateTitle = async (prompt, conversationId) => {
  try {
    const { data } = await api.post("/api/agent/title", { prompt, conversationId })
    return data?.title
  } catch (error) {
    console.log(error)
    return null
  }
}