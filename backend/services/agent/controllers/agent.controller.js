import axios from "axios"
import { graph } from "../graph/agent.workflow.js"
import { addMessage } from "../utils/memory.js"
import redis from "../../../shared/redis/redis.js"
export const agent = async(req,res)=>{
    try {
        const {prompt,conversationId} = req.body
        if(!prompt || !conversationId){
            return res.status(400).json({message:"prompt and conversationId are required"})
        }

        const result = await graph.invoke({
            prompt,conversationId
        })

        let response = result.aiResponse || "This specialist is still being built — try asking a general question for now!"

        if(typeof response !== "string"){
            response = JSON.stringify(response)
        }
        await addMessage(conversationId,"user",prompt)
        await addMessage(conversationId,"assistant",response)

        await axios.post(`${process.env.CHAT_SERVICE}/messages`,{
            conversationId,
            role:"user",
            content:prompt
        })
        await axios.post(`${process.env.CHAT_SERVICE}/messages`,{
            conversationId,
            role:"assistant",
            content:response
        })

        return res.status(200).json(response)
    } catch (error) {
        console.error("agent error:", error?.response?.data || error);
        return res.status(500).json({ message: "Internal server error" });
    }
}