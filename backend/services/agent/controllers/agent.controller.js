import axios from "axios"
import { graph } from "../graph/agent.workflow.js"
import { addMessage } from "../utils/memory.js"
import redis from "../../../shared/redis/redis.js"
import { getllmModel } from "../utils/llm.models.js"

const AGENT_COSTS = { chat: 1, search: 2, coding: 5, pdf: 5, ppt: 5, vision: 10 }

export const agent = async(req,res)=>{
    try {
        const {prompt,conversationId,agent} = req.body
        if(!prompt || !conversationId){
            return res.status(400).json({message:"prompt and conversationId are required"})
        }

        const userId = req.headers["x-user-id"]

        // gate: block zero-balance users BEFORE doing paid LLM work (read-only)
        const balance = await axios.get(`${process.env.BILLING_SERVICE}/credits`, {
            headers: { "x-user-id": userId },
        }).catch((e) => e.response)

        if ((balance?.data?.credits ?? 0) <= 0) {
            return res.status(402).json({ message: "Insufficient credits" })
        }

        const result = await graph.invoke({
            prompt,conversationId,agent
        })

        const cost = AGENT_COSTS[result.agent] ?? 1
        await axios.post(`${process.env.BILLING_SERVICE}/deduct`,
            { cost },
            { headers: {
                "x-internal-key": process.env.INTERNAL_API_KEY,
                "x-user-id": userId,
            }},
        ).catch((e) => e.response)

        let response = {
            answer:result.aiResponse || "This specialist is still being built — try asking a general question for now!",
            images : result.images,
            artifact : result.artifact || null
        }

        if(typeof response.answer !== "string"){
            response.answer = JSON.stringify(response.answer)
        }
        await addMessage(conversationId,"user",prompt)
        await addMessage(conversationId,"assistant",response.answer,response.artifact)

        await axios.post(`${process.env.CHAT_SERVICE}/messages`,{
            conversationId,
            role:"user",
            content:prompt
        })
        await axios.post(`${process.env.CHAT_SERVICE}/messages`,{
            conversationId,
            role:"assistant",
            content:response.answer,
            images:response.images,
            artifact:response.artifact
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