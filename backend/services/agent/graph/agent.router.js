import { getllmModel } from "../utils/llm.models.js";

const AGENTS = ["chat", "search", "coding", "pdf", "ppt", "vision"];

export const router = async (state) => {
  if(state.agent && state.agent !== "auto"){
    return {
      ...state,
      agent:state.agent
    }
  }
  const llm = getllmModel("router");

  const prompt = `You are a routing system for a multi-agent AI platform. Your only job is to read the user's query and decide which specialized agent should handle it.

Available agents:
- chat: general conversation, questions, explanations — INCLUDING questions about programming languages, frameworks, tools or concepts (e.g. "what is React", "compare Python and Go", "explain closures"). Chat can include short code examples in its answers.
- search: queries needing current/real-time information from the web (news, prices, weather, recent events)
- coding: ONLY when the user explicitly asks to write, generate, debug, fix, refactor or review actual code, or to create a code file/project (e.g. "write a function that...", "fix this error in my code", "build me a component")
- pdf: creating/generating a PDF document, or analyzing, summarizing, and answering questions about an uploaded PDF file
- ppt: creating/generating a PowerPoint presentation or slides, or analyzing, summarizing, and answering questions about an uploaded PPT file
- vision:generating image, analyzing image, describing image, or answering questions about an image

Rules:
- If the query is ABOUT programming (concepts, comparisons, explanations) rather than a request to produce or fix code, choose chat.
- Respond with EXACTLY one word: the agent name.
- The word must be one of: chat, search, coding, pdf, ppt, vision
- No punctuation, no explanation, no extra text.

User query: ${state.prompt}

Agent:`;

  const response = await llm.invoke(prompt);

  const agent = response.content
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  return { ...state,agent: AGENTS.includes(agent) ? agent : "chat" };
};
