import Anthropic from "@anthropic-ai/sdk";

export type AskLoopSource = {
  ref: string;
  id: string;
  content: string;
  customerLabel: string;
  channel: string;
  sentiment: string;
  featureArea: string;
  themes: string[];
  createdAt: string;
};

function fallbackAnswer(question: string, sources: AskLoopSource[]) {
  if (sources.length === 0) {
    return "I could not find enough feedback evidence to answer this question. Try asking about payments, onboarding, dashboard, support, mobile experience, or recent complaints.";
  }

  const sentimentCount = sources.reduce<Record<string, number>>((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {});

  const themeCount = sources.reduce<Record<string, number>>((acc, item) => {
    item.themes.forEach((theme) => {
      acc[theme] = (acc[theme] || 0) + 1;
    });

    if (item.themes.length === 0 && item.featureArea) {
      acc[item.featureArea] = (acc[item.featureArea] || 0) + 1;
    }

    return acc;
  }, {});

  const topThemes = Object.entries(themeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme, count]) => `${theme} (${count})`)
    .join(", ");

  const mainSentiment = Object.entries(sentimentCount).sort((a, b) => b[1] - a[1])[0]?.[0];

  const sourceRefs = sources.slice(0, 4).map((item) => item.ref).join(", ");

  return `Based on ${sources.length} relevant feedback records, the main pattern is ${mainSentiment || "mixed"} sentiment. The most repeated areas are ${topThemes || "not clearly assigned yet"}. Several customer comments point to recurring product/service concerns, so this should be reviewed by the team. Evidence: ${sourceRefs}.`;
}

export async function generateAskLoopAnswer(
  question: string,
  sources: AskLoopSource[]
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "demo_key") {
    return fallbackAnswer(question, sources);
  }

  const context = sources
    .map(
      (item) => `
${item.ref}
Customer: ${item.customerLabel}
Channel: ${item.channel}
Sentiment: ${item.sentiment}
Feature Area: ${item.featureArea}
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
    max_tokens: 900,
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: `
You are Ask LOOP, an AI assistant for a customer-feedback intelligence platform.

User question:
${question}

Feedback evidence:
${context}

Instructions:
- Answer ONLY using the feedback evidence above.
- Cite feedback records using refs like [F1], [F2].
- If evidence is not enough, say that clearly.
- Keep answer practical for product/support teams.
- Do not invent numbers or facts not present in evidence.
        `,
      },
    ],
  });

  const text = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n")
    .trim();

  return text || fallbackAnswer(question, sources);
}
