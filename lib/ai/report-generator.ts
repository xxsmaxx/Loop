import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const reportSchema = z.object({
  executiveSummary: z.string().min(10),
  topPainPoints: z.array(z.string()).min(1).max(5),
  topWins: z.array(z.string()).min(1).max(5),
  recommendedActions: z.array(z.string()).min(1).max(6),
  customerQuotes: z.array(z.string()).max(5),
});

export type VocReportContent = z.infer<typeof reportSchema>;

type ReportFeedback = {
  content: string;
  customerLabel: string | null;
  channel: string;
  sentiment: string;
  sentimentScore: number;
  featureArea: string | null;
  themes: string[];
};

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("Claude did not return valid report JSON.");
  }

  return JSON.parse(match[0]);
}

function fallbackReport(feedbacks: ReportFeedback[]): VocReportContent {
  const negative = feedbacks.filter((item) => item.sentiment === "NEG");
  const positive = feedbacks.filter((item) => item.sentiment === "POS");

  const themeCount = new Map<string, number>();

  feedbacks.forEach((item) => {
    const labels = item.themes.length > 0 ? item.themes : [item.featureArea || "General Feedback"];

    labels.forEach((label) => {
      themeCount.set(label, (themeCount.get(label) || 0) + 1);
    });
  });

  const topThemes = Array.from(themeCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme]) => theme);

  return {
    executiveSummary: `This VoC report is based on ${feedbacks.length} feedback records. The main customer themes are ${topThemes.join(", ") || "general product experience"}. Negative feedback should be prioritized for product and support improvements, while positive feedback highlights areas that are already working well.`,
    topPainPoints:
      negative.slice(0, 3).map((item) => item.featureArea || item.themes[0] || "Customer pain point") ||
      ["Customer issues need deeper review."],
    topWins:
      positive.slice(0, 3).map((item) => item.featureArea || item.themes[0] || "Customer win") ||
      ["Positive customer experience should be maintained."],
    recommendedActions: [
      "Review high-frequency negative feedback themes with the product team.",
      "Create action items for the top customer pain points.",
      "Improve help content for repeated onboarding and support issues.",
      "Track sentiment weekly to confirm whether fixes are working.",
    ],
    customerQuotes: feedbacks.slice(0, 5).map((item) => item.content),
  };
}

export async function generateVocReportContent(feedbacks: ReportFeedback[]) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "demo_key") {
    return fallbackReport(feedbacks);
  }

  const context = feedbacks
    .slice(0, 50)
    .map(
      (item, index) => `
F${index + 1}
Customer: ${item.customerLabel || "Unknown"}
Channel: ${item.channel}
Sentiment: ${item.sentiment}
Score: ${item.sentimentScore}
Feature Area: ${item.featureArea || "Unassigned"}
Themes: ${item.themes.join(", ") || "Unassigned"}
Feedback: ${item.content}
`
    )
    .join("\n---\n");

  const anthropic = new Anthropic({
    apiKey,
  });

  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
    max_tokens: 1200,
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: `
You are creating a Voice of Customer report for Project LOOP.

Feedback evidence:
${context}

Return ONLY valid JSON:
{
  "executiveSummary": "clear business summary",
  "topPainPoints": ["pain point 1", "pain point 2", "pain point 3"],
  "topWins": ["win 1", "win 2", "win 3"],
  "recommendedActions": ["action 1", "action 2", "action 3", "action 4"],
  "customerQuotes": ["short quote 1", "short quote 2"]
}

Rules:
- Use only the feedback evidence.
- Keep it useful for product/support leaders.
- No markdown.
- No explanation outside JSON.
        `,
      },
    ],
  });

  const text = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  const parsed = extractJson(text);
  return reportSchema.parse(parsed);
}
