import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canManageFeedback, getCurrentUser } from "@/lib/auth";
import { classifyFeedback } from "@/lib/ai/classifier";
import { storeFeedbackClassification } from "@/lib/ai/store-classification";

export async function POST(
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
        { message: "Forbidden. Only Admin or Analyst can classify feedback." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const feedback = await prisma.feedback.findFirst({
      where: {
        id,
        workspaceId: currentUser.workspaceId,
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { message: "Feedback not found." },
        { status: 404 }
      );
    }

    const classification = await classifyFeedback(feedback.content);

    const updatedFeedback = await prisma.$transaction((tx) =>
      storeFeedbackClassification(tx, feedback.id, currentUser.workspaceId, classification)
    );

    return NextResponse.json(
      {
        message: "Feedback classified successfully.",
        classification,
        feedback: updatedFeedback,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("CLASSIFY_FEEDBACK_ERROR:", error);

    return NextResponse.json(
      { message: error.message || "AI classification failed." },
      { status: 500 }
    );
  }
}