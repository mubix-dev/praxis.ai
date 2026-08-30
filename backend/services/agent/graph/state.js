import {Annotation} from "@langchain/langgraph"

export const agentState = Annotation.Root({
    userId:Annotation(),
    prompt:Annotation(),
    aiResponse:Annotation(),
    agent:Annotation(),
    conversationId:Annotation(),
    searchResults:Annotation(),
    images:Annotation(),
    artifact:Annotation(),
    file:Annotation()
})