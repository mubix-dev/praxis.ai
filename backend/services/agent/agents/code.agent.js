import { getllmModel } from "../utils/llm.models.js"
import { PRAXIS_IDENTITY } from "../utils/identity.js"
import { getMemory } from "../utils/memory.js"
import { checkAgentLimit } from "../utils/agentLimit.js"
import { deductCredits } from "../utils/deductCredits.js"

export const codingAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "coding")


    const intentllm = getllmModel("intent")
    const llm = getllmModel("coding")

    const history = (await getMemory(state.conversationId)) || []
    const lastArtifact = [...history].reverse().find((m) => m.artifact)?.artifact

    const artifactContext = lastArtifact
      ? `\n\nThe user's current project (built earlier in this conversation): "${lastArtifact.title}" (${lastArtifact.framework})\n` +
      lastArtifact.files.map((f) => `--- ${f.path} ---\n${f.content}`).join("\n\n")
      : ""

    const intentResponse = await intentllm.invoke(`You are an intent classifier for a coding assistant.
Classify the user's request into exactly one of:
CODE_GENERATION - wants new code, an app, component, page or file built
CODE_REVIEW - wants existing code reviewed for quality or bugs
CODE_EXPLANATION - wants code or a concept in their code explained
DEBUGGING - has an error, bug or unexpected behavior to fix
OPTIMIZATION - wants working code made faster, cleaner or refactored
CONVERSION - wants code translated to another language or framework
DOCUMENTATION - wants comments, docs or a README written
GENERAL - anything NOT related to code (general questions, chit-chat, questions about Praxis itself)

Reply with EXACTLY one word from the list. No punctuation, no explanation.

User request:
${state.prompt}`)

    const intent = intentResponse.content.trim().toUpperCase()

    if (intent === "GENERAL") {
      const response = await llm.invoke(`You are Praxis, an intelligent, warm and helpful AI assistant.
Answer the user's question clearly in markdown. Be genuinely helpful even though this isn't a coding question.

${PRAXIS_IDENTITY}

User request:
${state.prompt}`)

      return { ...state, aiResponse: response.content }
    }

    if (intent === "CODE_GENERATION") {
      const genPrompt = `You are Praxis Code, an expert full-stack engineer and UI designer.

Build exactly what the user asks, in the framework THEY request (React, Vue, Next.js, etc. are all fine).
If NO framework is specified and it's web content, default to plain HTML + CSS + JavaScript as exactly three files:
- index.html (links style.css and script.js)
- style.css (all styling)
- script.js (all behavior)
No frameworks, no CDNs, no build tools for the default stack.

UI requirements:
- Modern, clean, minimal design: generous spacing, rounded corners, subtle borders and shadows, elegant typography
- Fully responsive, mobile-first — must look right from 320px phones to wide desktops
- Polished dark theme by default (unless the user asks for light), with real hover/focus states and smooth transitions
- Should be complete website

Code requirements:
- Complete and runnable — every file full, no placeholders, no "..." omissions, no TODOs
- Clean, readable, conventionally structured for the chosen framework
- Use Unsplash for images

Return ONLY valid JSON — no markdown fences, no text before or after — in exactly this shape:
{
  "title": "short name of what you built",
  "framework": "html | react | vue | nextjs | ...",
  "files": [
    { "path": "filename.ext", "language": "html|css|javascript|jsx|...", "content": "full file content" }
  ],
  "preview": "ONE self-contained HTML document string that runs the app inside an iframe: inline the CSS in a <style> tag and the JS in a <script> tag. For framework apps, provide a CDN-based standalone equivalent ONLY if it will genuinely work (e.g. React via unpkg UMD + babel-standalone). If a fully working preview is not possible, set preview to an empty string — never output a broken or partial preview.",
  "explanation": "2-4 sentences of markdown: what was built and how to use it"
}

File naming rules:
- Default stack (no framework requested): exactly index.html, style.css, script.js
- React: conventional React names — App.jsx, App.css, components/TodoItem.jsx etc. (jsx extension, PascalCase components)
- Other frameworks: their own conventional file names and structure — NEVER fall back to index.html/style.css/script.js names for framework code

files schema (every entry): { "path": string (filename with extension matching the language), "language": string (html|css|javascript|jsx|ts|vue|...), "content": string (the COMPLETE file) } — one entry per file, in the order they should be read.
Escape all quotes and newlines correctly so the JSON parses.
${artifactContext ? "\nIf the user is asking to MODIFY the current project below, return the FULL updated files (all of them, complete), keeping everything that wasn't asked to change." + artifactContext : ""}

User request:
${state.prompt}`

      const parseArtifact = (content) => {
        let raw = typeof content === "string" ? content : String(content)
        const start = raw.indexOf("{")
        const end = raw.lastIndexOf("}")
        if (start === -1 || end <= start) return null
        try {
          const artifact = JSON.parse(raw.slice(start, end + 1))
          return artifact?.files?.length ? artifact : null
        } catch {
          return null
        }
      }

      let artifact = parseArtifact((await llm.invoke(genPrompt)).content)
      if (!artifact) {
        // one retry — truncated or malformed JSON happens occasionally
        artifact = parseArtifact((await llm.invoke(genPrompt)).content)
      }

      if (artifact) {
        return {
          ...state,
          artifact,
          aiResponse: `${artifact.explanation}\n\n*Open the artifact panel to view the code and live preview.*`,
        }
      }

      return {
        ...state,
        aiResponse:
          "I wasn't able to package that project into the artifact view this time — it may have been too large to generate in one go. Please try again, or break the request into smaller parts (for example, one page or component at a time).",
      }
    }

    const response = await llm.invoke(`You are Praxis Code, an expert senior software engineer.
The user's request type is: ${intent}.

- Answer in clear markdown: code blocks with language tags, short headings, bullet points where useful
- Be thorough: explain the why, not just the what
- For DEBUGGING: identify the root cause first, then show the fixed code
- For CODE_REVIEW: list concrete issues ranked by severity, each with a suggested fix
- For CONVERSION: show the converted code in full, then note the key differences
${artifactContext ? "\nWhen the user refers to \"the code\", \"the html\", etc., they mean their current project below." + artifactContext : ""}

${PRAXIS_IDENTITY}

User request:
${state.prompt}`)
    await deductCredits(5, state.userId)
    return { ...state, aiResponse: response.content }
  } catch (error) {
    console.log("codeAgent error:", error);
    return {
      ...state,
      aiResponse: error?.data?.message
    }
  }
}
