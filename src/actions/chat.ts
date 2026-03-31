"use server";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Part,
  Content,
} from "@google/generative-ai";

type Message = {
  role: "user" | "assistant";
  content: string;
  attachment?: string | null;
};

type SendMessageOptions = {
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

function parseAttachment(
  attachment: string,
): { mimeType: string; data: string } | null {
  if (!attachment.startsWith("data:")) return null;

  const commaIndex = attachment.indexOf(",");
  if (commaIndex === -1) return null;

  const header = attachment.slice(0, commaIndex);

  const data = attachment.slice(commaIndex + 1);

  const mimeMatch = header.match(/^data:([^;]+);base64$/);
  if (!mimeMatch || !data) return null;

  return { mimeType: mimeMatch[1], data };
}

function buildContents(messages: Message[]): Content[] {
  return messages.map((msg) => {
    const role = msg.role === "assistant" ? "model" : "user";
    const parts: Part[] = [{ text: msg.content || " " }];

    if (msg.attachment) {
      const parsed = parseAttachment(msg.attachment);
      if (parsed) {
        parts.push({
          inlineData: { mimeType: parsed.mimeType, data: parsed.data },
        });
      }
    }

    return { role, parts };
  });
}

export async function sendMessage(
  messages: Message[],
  options: SendMessageOptions = {},
): Promise<string> {
  const {
    systemInstruction = "You are a helpful assistant.",
    temperature = 1,
    maxOutputTokens = 8192,
  } = options;

  const model = genAI.getGenerativeModel(
    {
      model: "gemini-2.5-flash-lite",
      systemInstruction,
      safetySettings: SAFETY_SETTINGS,
      generationConfig: { temperature, maxOutputTokens },
    },
    { apiVersion: "v1beta" },
  );

  try {
    const result = await model.generateContent({
      contents: buildContents(messages),
    });
    const response = result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response from model.");
    return text;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate response.";
    console.error("Gemini API Error:", error);
    throw new Error(message);
  }
}
