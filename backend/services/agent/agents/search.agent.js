import { searchTool } from "../utils/tavily.js"

export const searchAgent = async (state) => {
    try {
        const data = await searchTool.invoke({ query: state.prompt })

        const searchResults = data.results
            .map((r) => `- ${r.title}: ${r.content} (${r.url})`)
            .join("\n")

        return { ...state, searchResults, images: data.images || [] }
    } catch (error) {
        console.log("searchAgent error:", error.message)
        return { ...state, searchResults: null, images: [] }
    }
}
