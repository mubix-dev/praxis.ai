import { getllmModel } from "../utils/llm.models.js";
import axios from "axios";
import { getFromS3, uploadToS3 } from "../utils/s3.js";

export const visionAgent = async (state) => {
  try {
    const llm = getllmModel("vision");

    const response =
      await llm.invoke(`You are an elite AI image prompt engineer specialized in ultra-realistic 8K photography.
Convert the user's request into ONE hyper-realistic photographic image generation prompt.

Weave all of this into a single vivid paragraph:
- Main subject and its action, described concretely with realistic physical detail (textures, materials, imperfections)
- Setting/background and composition (framing, perspective, focal point, rule of thirds)
- Professional camera setup: specific camera body and lens (e.g. shot on Sony A7R V, 85mm f/1.4), aperture, depth of field, angle
- Natural, realistic lighting: golden hour, soft window light, overcast diffusion, cinematic rim light — whatever fits the scene
- True-to-life color grading and atmosphere (film-like tones, subtle grain)
- End with: photorealistic, hyper-detailed, 8k resolution, sharp focus, natural skin texture, professional photography, RAW photo

Rules:
- ALWAYS produce a realistic photograph-style prompt — never illustration, cartoon, anime or 3D render, even if borderline; only break realism if the user EXPLICITLY names another art style.
- Reply with ONLY the final image prompt — no headings, no explanation, no quotes around it.
- Keep it under 120 words.
- Never include real people's names or copyrighted characters — describe a generic look-alike instead.

User request:
${state.prompt}`);

    const prompt = response.content.trim();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&width=1024&height=1024&nologo=true&enhance=true`;

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 120000,
    });

    const buffer = Buffer.from(imageResponse.data);
    const contentType = imageResponse.headers["content-type"] || "image/jpeg";
    const filename = `image-${Date.now()}.${contentType.includes("png") ? "png" : "jpg"}`;

    await uploadToS3(filename, buffer, contentType);

    const downloadUrl = await getFromS3(filename, 7 * 24 * 60 * 60);

    return {
      ...state,
      images: [downloadUrl],
      aiResponse: `Here's your image! 🎨\n\n[⬇ Download image](${downloadUrl})`,
    };
  } catch (error) {
    console.log("visionAgent error:", error.message);
    return {
      ...state,
      images: [],
      aiResponse:
        "I couldn't generate the image right now — please try again in a moment, or rephrase your request.",
    };
  }
};
