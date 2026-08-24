import { getllmModel } from "../utils/llm.models.js";
import { getMemory } from "../utils/memory.js";

const AGENTS = ["chat", "search", "coding", "pdf", "ppt", "vision"];

export const router = async (state) => {
  if(state.agent && state.agent !== "auto"){
    return {
      ...state,
      agent:state.agent
    }
  }

  if(state.file.mimetype === "application/pdf"){
    return{
      ...state,
      agent:"pdfRag"
    }
  }

  if(state.file.mimetype.startsWith("image/")){
    return{
      ...state,
      agent:"imageAnalyzer"
    }
  }

  const llm = getllmModel("router");

  const history = (await getMemory(state.conversationId)) || [];
  const recent = history
    .slice(-4)
    .map((m) => `${m.role}: ${String(m.content).slice(0, 200)}`)
    .join("\n");

  const prompt = `You are a routing system for a multi-agent AI platform. Your only job is to read the user's query and decide which specialized agent should handle it.

Available agents:
- chat: general conversation, questions, explanations — INCLUDING questions about programming languages, frameworks, tools or concepts (e.g. "what is React", "compare Python and Go", "explain closures"). Chat can include short code examples in its answers.
- search: queries needing current/real-time information from the web (news, prices, weather, recent events) — ALSO for finding or showing EXISTING images/photos of things (e.g. "show me pictures of the Eiffel Tower", "what does a quokka look like")
- coding: ONLY when the user explicitly asks to write, generate, debug, fix, refactor or review actual code, or to create a code file/project (e.g. "write a function that...", "fix this error in my code", "build me a component")
- pdf: ANY request to create a written document or file — "generate a pdf on X", "give me a doc on X", "make a document/report/guide about X" — or analyzing, summarizing, and answering questions about an uploaded PDF file
- ppt: creating/generating a PowerPoint presentation or slides, or analyzing, summarizing, and answering questions about an uploaded PPT file
- vision: ONLY when the user explicitly asks to GENERATE, CREATE, MAKE or DRAW a brand-new image (e.g. "generate an image of...", "create a picture of...", "make me a wallpaper of...")

Rules:
- If the query is ABOUT programming (concepts, comparisons, explanations) rather than a request to produce or fix code, choose chat.
- Image intent: wanting to SEE existing photos of something → search. Wanting a NEW image created from imagination → vision. When unsure between the two, choose search.
- Follow-ups that continue a previous generation task ("another one on X", "now do java", "make one about Y") go to the SAME agent that handled that task — check the recent conversation below.
- Respond with EXACTLY one word: the agent name.
- The word must be one of: chat, search, coding, pdf, ppt, vision
- No punctuation, no explanation, no extra text.

${recent ? `Recent conversation:\n${recent}\n\n` : ""}User query: ${state.prompt}

Agent:`;

  const response = await llm.invoke(prompt);

  const agent = response.content
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  return { ...state,agent: AGENTS.includes(agent) ? agent : "chat" };
};
