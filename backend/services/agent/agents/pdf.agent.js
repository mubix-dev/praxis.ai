import { getllmModel } from "../utils/llm.models.js";
import { getFromS3, uploadToS3 } from "../utils/s3.js";
import { buildPdf } from "../utils/pdf.js";
import { getMemory } from "../utils/memory.js";

export const pdfAgent = async (state) => {
  try {
    const llm = getllmModel("pdf");

    const history = (await getMemory(state.conversationId)) || [];
    const context = history
      .slice(-6)
      .map((m) => `${m.role}: ${String(m.content).slice(0, 500)}`)
      .join("\n");

    const response =
      await llm.invoke(`You are Praxis Docs, an expert professional document writer.
Write a complete, well-structured document for the user's request.

Understanding the request:
- The user's request states the TOPIC of the document. "generate a pdf on X" / "make a pdf about X" means: write a document whose subject is X.
- Example: "generate a pdf on python" = a document about the Python programming language — NOT about PDF generation, PDF tools or PDF libraries.
- Never write about PDF technology itself unless the user explicitly asks for a document about PDFs.
- If the request is short or vague ("generate the doc", "make the pdf now"), the topic is whatever the conversation below was about — use it.

${context ? `Conversation so far:\n${context}\n` : ""}
Content rules:
- Thorough and professional: real substance in every section, not filler
- Clear structure: logical section order, 4-8 sections for a typical document
- Plain text only inside content (no markdown symbols like ** or #). Use "- " at line start for bullet lists, "\\n\\n" between paragraphs.

Return ONLY valid JSON — no markdown fences, no text outside — in exactly this shape:
{
  "title": "Document Title",
  "sections": [
    { "heading": "Section heading", "content": "Full section text..." }
  ],
  "summary": "1-2 sentence description of the document for the chat reply"
}

User request:
${state.prompt}`);

    let raw = response.content;

    if (typeof raw !== "string") raw = String(raw);
    raw = raw
      .trim()
      .replace(/^```json?\s*/i, "")
      .replace(/```$/, "");

    const docData = JSON.parse(raw);

    const buffer = await buildPdf(docData);
    const safeTitle = docData.title
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
    const filename = `document-${safeTitle}-${Date.now()}.pdf`;
    await uploadToS3(filename, buffer, "application/pdf");

    const viewUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `Your PDF is ready! 📄\n\n**${docData.title}**\n${docData.summary || ""}\n\n[👁 View PDF](${viewUrl})\n\n*This link expires in 24 hours — download the file to keep it.*`,
    };
  } catch (error) {
    console.log("pdfAgent error:", error.message);
    return {
      ...state,
      aiResponse:
        "I couldn't generate the PDF right now — please try again or rephrase your request.",
    };
  }
};
