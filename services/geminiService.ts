import { GoogleGenAI, Type } from "@google/genai";
import { World } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to guide the World Building logic
const SYSTEM_INSTRUCTION = `
You are a worldbuilding and cinematic art generator.
Your task: Given a short seed concept from the user, create a complete WORLD PACKAGE in JSON format only.

Requirements:
1) Create a concise world title (3~6 words).
2) Make a tagline (1 sentence, cinematic, atmospheric).
3) Define 3–5 core world pillars (bullet points).
4) Generate 6 distinct LOCATIONS in this world (limited to 6 for this demo for performance).
5) Provide Korean translations for all display text (title, tagline, pillars, location details).

For each LOCATION, include:
- id: (short English snake_case, e.g., "neon_dockyard_01")
- name: (short English location name)
- name_ko: (Korean translation of name)
- role: (its story/functional role in the world)
- role_ko: (Korean translation of role)
- mood: (visual tone keywords, e.g., "foggy / neon / ruined / ancient tech")
- mood_ko: (Korean translation of mood)
- story_hint: (one short mysterious story hook sentence)
- story_hint_ko: (Korean translation of story hook)
- image_prompt_short: (concise prompt for image model)
- image_prompt_long: (highly detailed cinematic prompt optimized for image generation, include: lighting, mood, colors, scale, composition, environment, style cues. DO NOT mention camera brands, DO NOT include artist names.)

Tone: cinematic, atmospheric, emotional, worldbuilding-friendly.
`;

export const generateWorldData = async (seed: string): Promise<World> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `SEED: ${seed}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            title_ko: { type: Type.STRING },
            tagline: { type: Type.STRING },
            tagline_ko: { type: Type.STRING },
            pillars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING },
                  ko: { type: Type.STRING },
                },
                required: ["en", "ko"],
              },
            },
            locations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  name_ko: { type: Type.STRING },
                  role: { type: Type.STRING },
                  role_ko: { type: Type.STRING },
                  mood: { type: Type.STRING },
                  mood_ko: { type: Type.STRING },
                  story_hint: { type: Type.STRING },
                  story_hint_ko: { type: Type.STRING },
                  image_prompt_short: { type: Type.STRING },
                  image_prompt_long: { type: Type.STRING },
                },
                required: [
                  "id",
                  "name",
                  "name_ko",
                  "role",
                  "role_ko",
                  "mood",
                  "mood_ko",
                  "story_hint",
                  "story_hint_ko",
                  "image_prompt_short",
                  "image_prompt_long",
                ],
              },
            },
          },
          required: ["title", "title_ko", "tagline", "tagline_ko", "pillars", "locations"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No text returned from Gemini");
    }

    const data = JSON.parse(response.text) as World;
    return data;
  } catch (error) {
    console.error("Error generating world data:", error);
    throw error;
  }
};

export const generateLocationImage = async (prompt: string): Promise<string> => {
  try {
    // Switched to imagen-3.0-generate-001 to fix RPC failures with gemini-2.5-flash-image
    const response = await ai.models.generateImages({
      model: "imagen-3.0-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "16:9",
        outputMimeType: "image/jpeg",
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;

    if (imageBytes) {
      return `data:image/jpeg;base64,${imageBytes}`;
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
