import { searchTool } from "../utils/tavily.js"
import { checkAgentLimit } from "../utils/agentLimit.js"
import { deductCredits } from "../utils/deductCredits.js"

export const searchAgent = async (state) => {
    try {
        const cost = 1
        await checkAgentLimit(state.userId, "search")
        await deductCredits(cost, state.userId)
        const data = await searchTool.invoke({ query: state.prompt })

        const searchResults = data.results
            .map((r) => `- ${r.title}: ${r.content} (${r.url})`)
            .join("\n")

        const wantsImages = /image|photo|picture|show me|what does .* look like/i.test(state.prompt)

        return { ...state, searchResults, images: wantsImages ? data.images || [] : [] }
    } catch (error) {
        console.log("searchAgent error:", error)
        return {
            ...state,
            aiResponse: error?.data?.message,
            searchResults:null,
            images:[]
        }
    }
}





