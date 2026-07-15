export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { generateAskLoopAnswer, type AskLoopSource } from "@/lib/ai/ask-loop";

const askSchema = z.object({
  question: z.string().min(3, "Question is required").max(500),
});

const stopWords = new Set([
  "what",
  "why",
  "how",
  "when",
  "where",
  "which",
  "with",
  "from",
  "that",
  "this",
  "there",
  "their",
  "about",
  "customer",
  "customers",
  "feedback",
  "issue",
  "issues",
  "problem",
  "problems",
  "loop",
]);

function getKeywords(question: string) {
  return question
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 4 && !stopWords.has(word))
    .slice(0, 8);
}

function toSource(item: any, index: number): AskLoopSource {
  return {
    ref: `[F${index + 1}]`,
    id: item.id,
    content: item.content,
    customerLabel: item.customerLabel || "Unknown Customer",
    channel: item.channel,
    sentiment: item.sentiment,
    featureArea: item.featureArea || "Unassigned",
    themes:
      item.feedbackThemes?.map((entry: any) => entry.theme.name).filter(Boolean) || [],
    createdAt: item.createdAt?.toISOString?.() || String(item.createdAt),
  };
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = askSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid question.", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const question = parsed.data.question;
    const keywords = getKeywords(question);

    const where: any = {
      workspaceId: currentUser.workspaceId,
    };

    if (keywords.length > 0) {
      where.OR = keywords.flatMap((keyword) => [
        { content: { contains: keyword, mode: "insensitive" } },
        { customerLabel: { contains: keyword, mode: "insensitive" } },
        { featureArea: { contains: keyword, mode: "insensitive" } },
      ]);
    }

    let feedbacks = await prisma.feedback.findMany({
      where,
      include: {
        feedbackThemes: {
          include: {
            theme: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    if (feedbacks.length < 3) {
      feedbacks = await prisma.feedback.findMany({
        where: {
          workspaceId: currentUser.workspaceId,
        },
        include: {
          feedbackThemes: {
            include: {
              theme: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      });
    }

    const sources = feedbacks.map(toSource);
    const answer = await generateAskLoopAnswer(question, sources);

    return NextResponse.json(
      {
        answer,
        sources,
        totalSources: sources.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("ASK_LOOP_ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Ask LOOP failed." },
      { status: 500 }
    );
  }
}
