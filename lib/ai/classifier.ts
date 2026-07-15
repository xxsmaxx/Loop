import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const classificationSchema = z.object({
  sentiment: z.enum(["POS", "NEU", "NEG"]),
  sentimentScore: z.number().min(-1).max(1),
  featureArea: z.string().min(1).max(80),
  themes: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        confidence: z.number().min(0).max(1),
      })
    )
    .min(1)
    .max(5),
});

export type ClassificationResult = z.infer<typeof classificationSchema>;

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("Claude did not return valid JSON.");
  }

  return JSON.parse(match[0]);
}

function fallbackClassification(content: string): ClassificationResult {
  const lower = content.toLowerCase();

  if (
    lower.includes("payment") ||
    lower.includes("checkout") ||
    lower.includes("invoice") ||
    lower.includes("refund") ||
    lower.includes("failed")
  ) {
    return {
      sentiment: "NEG",
      sentimentScore: -0.72,
      featureArea: "Payments",
      themes: [{ name: "Payments", confidence: 0.88 }],
    };
  }

  if (
    lower.includes("support") ||
    lower.includes("response") ||
    lower.includes("ticket") ||
    lower.includes("issue")
  ) {
    return {
      sentiment: "NEU",
      sentimentScore: -0.15,
      featureArea: "Support Quality",
      themes: [{ name: "Support Quality", confidence: 0.81 }],
    };
  }

  if (
    lower.includes("mobile") ||
    lower.includes("app") ||
    lower.includes("small screen")
  ) {
    return {
      sentiment: "NEG",
      sentimentScore: -0.55,
      featureArea: "Mobile Experience",
      themes: [{ name: "Mobile Experience", confidence: 0.84 }],
    };
  }

  if (
    lower.includes("dashboard") ||
    lower.includes("analytics") ||
    lower.includes("chart")
  ) {
    return {
      sentiment: "POS",
      sentimentScore: 0.63,
      featureArea: "Dashboard UX",
      themes: [{ name: "Dashboard UX", confidence: 0.83 }],
    };
  }

  if (
    lower.includes("onboarding") ||
    lower.includes("setup") ||
    lower.includes("guide")
  ) {
    return {
      sentiment: "NEU",
      sentimentScore: 0.05,
      featureArea: "Onboarding",
      themes: [{ name: "Onboarding", confidence: 0.8 }],
    };
  }

  return {
    sentiment: "NEU",
    sentimentScore: 0,
    featureArea: "General Feedback",
    themes: [{ name: "General Feedback", confidence: 0.7 }],
  };
}

export async function classifyFeedback(content: string): Promise<ClassificationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "demo_key") {
    return fallbackClassification(content);
  }

  const anthropic = new Anthropic({
    apiKey,
  });

  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
    max_tokens: 600,
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: `
You are an AI classifier for Project LOOP, a customer-feedback intelligence platform.

Classify this feedback:
"${content}"

Return ONLY valid JSON with this exact shape:
{
  "sentiment": "POS" | "NEU" | "NEG",
  "sentimentScore": number between -1 and 1,
  "featureArea": "short feature area",
  "themes": [
    { "name": "theme name", "confidence": number between 0 and 1 }
  ]
}

Rules:
- sentimentScore: negative means unhappy, positive means happy.
- themes max 5.
- Do not return markdown.
- Do not explain.
        `,
      },
    ],
  });

  const text = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  const parsed = extractJson(text);
  return classificationSchema.parse(parsed);
}
