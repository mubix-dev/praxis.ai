import { searchTool } from "../utils/tavily.js"

export const searchAgent = async (state) => {
    try {
        const data = await searchTool.invoke({ query: state.prompt })

        const searchResults = data.results
            .map((r) => `- ${r.title}: ${r.content} (${r.url})`)
            .join("\n")

        const wantsImages = /image|photo|picture|show me|what does .* look like/i.test(state.prompt)

        return { ...state, searchResults, images: wantsImages ? data.images || [] : [] }
    } catch (error) {
        console.log("searchAgent error:", error.message)
        return { ...state, searchResults: null, images: [] }
    }
}





