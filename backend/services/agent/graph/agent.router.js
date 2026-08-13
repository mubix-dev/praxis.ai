import { getllmModel } from "../utils/llm.models.js";

const AGENTS = ["chat", "search", "coding", "pdf", "ppt", "vision"];

export const router = async (state) => {
  const llm = getllmModel("router");

  const prompt = `You are a routing system for a multi-agent AI platform. Your only job is to read the user's query and decide which specialized agent should handle it.

Available agents:
- chat: general conversation, questions, explanations, or anything that fits no other agent
- search: queries needing current/real-time information from the web (news, prices, weather, recent events)
- coding: writing, debugging, explaining, or reviewing code
- pdf: creating/generating a PDF document, or analyzing, summarizing, and answering questions about an uploaded PDF file
- ppt: creating/generating a PowerPoint presentation or slides, or analyzing, summarizing, and answering questions about an uploaded PPT file
- vision:generating image, analyzing image, describing image, or answering questions about an image

Rules:
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
