export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { canManageFeedback, getCurrentUser } from "@/lib/auth";
import { generateVocReportContent } from "@/lib/ai/report-generator";

const reportSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  days: z.number().min(1).max(365).default(30),
});

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    const reports = await prisma.report.findMany({
      where: {
        workspaceId: currentUser.workspaceId,
      },
      include: {
        generatedBy: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error: any) {
    console.log("GET_REPORTS_ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Failed to fetch reports." },
      { status: 500 }
    );
  }
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

    if (!canManageFeedback(currentUser.role)) {
      return NextResponse.json(
        { message: "Forbidden. Only Admin or Analyst can generate reports." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parsed = reportSchema.parse(body);

    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - parsed.days);

    const feedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId: currentUser.workspaceId,
        createdAt: {
          gte: periodStart,
          lte: periodEnd,
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
        createdAt: "desc",
      },
      take: 100,
    });

    if (feedbacks.length === 0) {
      return NextResponse.json(
        { message: "No feedback found for this period." },
        { status: 400 }
      );
    }

    const reportFeedbacks = feedbacks.map((item) => ({
      content: item.content,
      customerLabel: item.customerLabel,
      channel: item.channel,
      sentiment: item.sentiment,
      sentimentScore: item.sentimentScore,
      featureArea: item.featureArea,
      themes: item.feedbackThemes.map((entry) => entry.theme.name),
    }));

    const content = await generateVocReportContent(reportFeedbacks);

    const report = await prisma.report.create({
      data: {
        title: parsed.title || `VoC Report - Last ${parsed.days} Days`,
        periodStart,
        periodEnd,
        contentJson: content,
        workspaceId: currentUser.workspaceId,
        generatedById: currentUser.id,
      },
      include: {
        generatedBy: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "VoC report generated successfully.",
        report,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("CREATE_REPORT_ERROR:", error);

    if (error?.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation failed.", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Failed to generate report." },
      { status: 500 }
    );
  }
}
