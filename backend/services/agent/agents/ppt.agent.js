import { getllmModel } from "../utils/llm.models.js";
import { getFromS3, uploadToS3 } from "../utils/s3.js";
import { buildPpt } from "../utils/ppt.js";
import { getMemory } from "../utils/memory.js";

export const pptAgent = async (state) => {
  try {
    const llm = getllmModel("ppt");

    const history = (await getMemory(state.conversationId)) || [];
    const context = history
      .slice(-6)
      .map((m) => `${m.role}: ${String(m.content).slice(0, 500)}`)
      .join("\n");

    const response =
      await llm.invoke(`You are Praxis Slides, an expert presentation designer.
Create a complete, professional slide deck for the user's request.

Understanding the request:
- The user's request states the TOPIC of the presentation. "make a ppt on X" means: a deck about X — never about PowerPoint itself.
- If the request is short or vague ("make the ppt now"), the topic is whatever the conversation below was about.

${context ? `Conversation so far:\n${context}\n` : ""}
Slide rules:
- 6-10 content slides for a typical deck
- Each slide: one clear heading + 3-5 concise bullets (max ~15 words each) — slides are talking points, not paragraphs
- Logical flow: intro/overview first, conclusion or takeaways last
- Plain text only, no markdown symbols

Return ONLY valid JSON — no markdown fences, no text outside — in exactly this shape:
{
  "title": "Deck Title",
  "subtitle": "one-line subtitle",
  "slides": [
    { "heading": "Slide heading", "bullets": ["point one", "point two"] }
  ],
  "summary": "1-2 sentence description for the chat reply"
}

User request:
${state.prompt}`);

    let raw = response.content;
    if (typeof raw !== "string") raw = String(raw);
    raw = raw
      .trim()
      .replace(/^```json?\s*/i, "")
      .replace(/```$/, "");
    const pptData = JSON.parse(raw);

    const buffer = await buildPpt(pptData);
    const safeTitle = pptData.title
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
    const filename = `presentation-${safeTitle}-${Date.now()}.pptx`;
    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    const viewUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `Your presentation is ready! 📊\n\n**${pptData.title}**\n${pptData.summary || ""}\n\n[⬇ Download PPT](${viewUrl})\n\n*This link expires in 24 hours — download the file to keep it.*`,
    };
  } catch (error) {
    console.log("pptAgent error:", error.message);
    return {
      ...state,
      aiResponse:
        "I couldn't generate the presentation right now — please try again or rephrase your request.",
    };
  }
};
