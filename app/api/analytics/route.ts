export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const feedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId: currentUser.workspaceId,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        feedbackThemes: {
          include: {
            theme: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const total = feedbacks.length;
    const negative = feedbacks.filter((item) => item.sentiment === "NEG").length;
    const positive = feedbacks.filter((item) => item.sentiment === "POS").length;
    const neutral = feedbacks.filter((item) => item.sentiment === "NEU").length;
    const newThisWeek = feedbacks.filter((item) => item.createdAt >= weekStart).length;

    const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0;

    const volumeMap = new Map<string, number>();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      volumeMap.set(formatDate(date), 0);
    }

    feedbacks.forEach((item) => {
      const key = formatDate(item.createdAt);
      volumeMap.set(key, (volumeMap.get(key) || 0) + 1);
    });

    const volumeOverTime = Array.from(volumeMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    const sentimentBreakdown = [
      { name: "Positive", value: positive },
      { name: "Neutral", value: neutral },
      { name: "Negative", value: negative },
    ];

    const themeMap = new Map<string, number>();

    feedbacks.forEach((item) => {
      if (item.feedbackThemes.length === 0) {
        const label = item.featureArea || "Unassigned";
        themeMap.set(label, (themeMap.get(label) || 0) + 1);
      }

      item.feedbackThemes.forEach((entry) => {
        themeMap.set(entry.theme.name, (themeMap.get(entry.theme.name) || 0) + 1);
      });
    });

    const topThemes = Array.from(themeMap.entries())
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return NextResponse.json(
      {
        stats: {
          total,
          negativePercent,
          newThisWeek,
          positive,
          neutral,
          negative,
        },
        volumeOverTime,
        sentimentBreakdown,
        topThemes,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("ANALYTICS_ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Failed to load analytics." },
      { status: 500 }
    );
  }
}
