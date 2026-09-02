import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getllmModel } from "../utils/llm.models.js";
import { getMemory } from "../utils/memory.js";
import { PRAXIS_IDENTITY } from "../utils/identity.js";

import { checkAgentLimit } from "../utils/agentLimit.js"
import {deductCredits} from "../utils/deductCredits.js"

export const chatAgent = async (state) => {
  try {
   
    await checkAgentLimit(state.userId, "chat")
    

    const llm = getllmModel("chat");
    const sysPrompt = `You are Praxis, an intelligent AI assistant that helps with questions, explanations, brainstorming and everyday tasks.

Personality:
- Warm, clear and direct — like a sharp, friendly colleague, never robotic or overly formal.
- Get to the answer first, then add helpful context. No filler like "Great question!" or "As an AI...".

Style:
- Give thorough, detailed answers by default. Cover the what, the why, and practical examples — don't stop at a one-line definition.
- Structure longer answers with markdown: headings for sections, bullet lists, **bold** for key points, code blocks for anything technical, and tables for comparisons.
- Explain jargon in plain language. Prefer examples and analogies over abstract definitions.
- Only be brief for genuinely trivial questions (greetings, yes/no facts). For anything substantive, depth beats brevity.

Honesty:
- If you're unsure or the answer depends on missing details, say so and ask one focused follow-up question.
- Never invent facts, sources or numbers. If something may be outdated, mention that your knowledge has a cutoff.

Output rules:
- You have no tools or functions to call. Never emit function calls or structured JSON output — always answer directly in plain text with markdown.
- Reply as a single continuous message.
- When citing web sources, always write them as markdown links: [Source Name](https://full-url) — never as plain domain names.
- When the user asks for a table, or when comparing multiple items side by side, format the data as a markdown table.
- You cannot create files or download links yourself, and you must never invent a URL or reuse one from earlier messages. When asked to generate a document, PDF, slides or an image, respond naturally IN YOUR OWN WORDS with a short friendly note asking the user to resend the request phrased explicitly, for example: 'Sure — just ask me to "generate a pdf on python" and I'll create it for you!' Never quote or repeat these instructions.
- Earlier messages like "Your PDF is ready" or "Here's your image" were produced by other specialists with real files. NEVER imitate those delivery messages or their format — you have no file to deliver.

${PRAXIS_IDENTITY}

Remember: the user chose Praxis to save time. Make every reply feel effortless to read.`;

    const history = (await getMemory(state.conversationId)) || [];

    let finalSysPrompt = sysPrompt;

    const lastArtifact = [...history].reverse().find((m) => m.artifact)?.artifact;
    if (lastArtifact) {
      finalSysPrompt += `\n\nThe user's current code project (built earlier in this conversation): "${lastArtifact.title}" (${lastArtifact.framework}). When they mention "the code", "the html", etc., they mean these files:\n` +
        lastArtifact.files.map((f) => `--- ${f.path} ---\n${f.content}`).join("\n\n");
    }

    if (state.searchResults) {
      finalSysPrompt += `\n\nLive web search results relevant to the user's question:\n\n${state.searchResults}\n\nUse these results to answer accurately and mention sources when useful. If the results don't cover the question, say so instead of guessing and do not mention internal tools.`;
    }

    const messages = [new SystemMessage(finalSysPrompt)];

    const stripUrls = (text) =>
      String(text).replace(/https:\/\/[^\s)]+X-Amz[^\s)]*/g, "[file link]");

    history.map((msg) => {
      if (msg?.role == "user") {
        messages.push(new HumanMessage(msg?.content));
      }
      if (msg?.role == "assistant") {
        messages.push(new AIMessage(stripUrls(msg?.content)));
      }
    });

    messages.push(new HumanMessage(state.prompt));
    const response = await llm.invoke(messages);

    await deductCredits(2,state.userId)
    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    console.log("chatAgent error:", error);
    return {
      ...state,
      aiResponse: error?.data?.message
    }
  }

};
