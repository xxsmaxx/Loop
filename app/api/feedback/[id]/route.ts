import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { canManageFeedback, getCurrentUser } from "@/lib/auth";
import { FeedbackChannel, FeedbackStatus, Sentiment } from "@prisma/client";

const updateFeedbackSchema = z.object({
  content: z.string().min(1).optional(),
  channel: z.nativeEnum(FeedbackChannel).optional(),
  customerLabel: z.string().optional(),
  sourceRef: z.string().optional(),
  sentiment: z.nativeEnum(Sentiment).optional(),
  sentimentScore: z.number().min(-1).max(1).optional(),
  status: z.nativeEnum(FeedbackStatus).optional(),
  featureArea: z.string().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const feedback = await prisma.feedback.findFirst({
      where: {
        id,
        workspaceId: currentUser.workspaceId,
      },
      include: {
        feedbackThemes: {
          include: {
            theme: true,
          },
        },
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { message: "Feedback not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ feedback }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch feedback." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { message: "Forbidden. Only Admin or Analyst can update feedback." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = updateFeedbackSchema.parse(body);

    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        id,
        workspaceId: currentUser.workspaceId,
      },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { message: "Feedback not found." },
        { status: 404 }
      );
    }

    const feedback = await prisma.feedback.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(
      {
        message: "Feedback updated successfully.",
        feedback,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("UPDATE_FEEDBACK_ERROR:", error);

    if (error?.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation failed.", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Failed to update feedback." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden. Only Admin can delete feedback." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        id,
        workspaceId: currentUser.workspaceId,
      },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { message: "Feedback not found." },
        { status: 404 }
      );
    }

    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Feedback deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("DELETE_FEEDBACK_ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Failed to delete feedback." },
      { status: 500 }
    );
  }
}
