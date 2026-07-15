import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { canManageFeedback, getCurrentUser } from "@/lib/auth";
import { FeedbackChannel, FeedbackStatus, Sentiment } from "@prisma/client";

const createFeedbackSchema = z.object({
  content: z.string().min(1, "Feedback content is required"),
  channel: z.nativeEnum(FeedbackChannel),
  customerLabel: z.string().optional(),
  sourceRef: z.string().optional(),
});

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

    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const channel = searchParams.get("channel") as FeedbackChannel | null;
    const sentiment = searchParams.get("sentiment") as Sentiment | null;
    const status = searchParams.get("status") as FeedbackStatus | null;

    const skip = (page - 1) * limit;

    const where: any = {
      workspaceId: currentUser.workspaceId,
    };

    if (search) {
      where.OR = [
        { content: { contains: search, mode: "insensitive" } },
        { customerLabel: { contains: search, mode: "insensitive" } },
        { featureArea: { contains: search, mode: "insensitive" } },
      ];
    }

    if (channel) where.channel = channel;
    if (sentiment) where.sentiment = sentiment;
    if (status) where.status = status;

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
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
        skip,
        take: limit,
      }),
      prisma.feedback.count({ where }),
    ]);

    return NextResponse.json(
      {
        feedbacks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("GET_FEEDBACK_ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Failed to fetch feedback." },
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
        { message: "Forbidden. Only Admin or Analyst can add feedback." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = createFeedbackSchema.parse(body);

    const feedback = await prisma.feedback.create({
      data: {
        content: validatedData.content,
        channel: validatedData.channel,
        customerLabel: validatedData.customerLabel || "Unknown Customer",
        sourceRef: validatedData.sourceRef || "manual-entry",
        status: FeedbackStatus.NEW,
        sentiment: Sentiment.NEU,
        sentimentScore: 0,
        workspaceId: currentUser.workspaceId,
      },
    });

    return NextResponse.json(
      {
        message: "Feedback added successfully.",
        feedback,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("CREATE_FEEDBACK_ERROR:", error);

    if (error?.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation failed.", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Failed to add feedback." },
      { status: 500 }
    );
  }
}
