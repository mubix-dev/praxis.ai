import axios from "axios"
import { graph } from "../graph/agent.workflow.js"
import { addMessage } from "../utils/memory.js"
import redis from "../../../shared/redis/redis.js"
import { getllmModel } from "../utils/llm.models.js"
export const agent = async(req,res)=>{
    try {
        const {prompt,conversationId,agent} = req.body
        if(!prompt || !conversationId){
            return res.status(400).json({message:"prompt and conversationId are required"})
        }

        const result = await graph.invoke({
            prompt,conversationId,agent
        })

        let response = {
            answer:result.aiResponse || "This specialist is still being built — try asking a general question for now!",
            images : result.images,
            artifact : result.artifact || null
        }

        if(typeof response.answer !== "string"){
            response.answer = JSON.stringify(response.answer)
        }
        await addMessage(conversationId,"user",prompt)
        await addMessage(conversationId,"assistant",response.answer)

        await axios.post(`${process.env.CHAT_SERVICE}/messages`,{
            conversationId,
            role:"user",
            content:prompt
        })
        await axios.post(`${process.env.CHAT_SERVICE}/messages`,{
            conversationId,
            role:"assistant",
            content:response.answer,
            images:response.images
        })

        return res.status(200).json(response)
    } catch (error) {
        console.error("agent error:", error?.response?.data || error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const generateTitle = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body
    if (!prompt || !conversationId) {
      return res.status(400).json({ message: "prompt and conversationId are required" })
    }

    const llm = getllmModel("title")
    const result = await llm.invoke(
      `Generate a short title (3-5 words, no quotes, no punctuation at the end) for a conversation that starts with this message:\n\n"${prompt}"\n\nReply with ONLY the title.`
    )
    const title = result.content.trim().replace(/^["']|["']$/g, "").slice(0, 60)

    await axios.patch(`${process.env.CHAT_SERVICE}/conversations/${conversationId}`, { title })

    return res.status(200).json({ title })
  } catch (error) {
    console.error("generateTitle error:", error?.response?.data || error)
    return res.status(500).json({ message: "Internal server error" })
  }
}