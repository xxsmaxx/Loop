import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canManageFeedback, getCurrentUser } from "@/lib/auth";
import { classifyFeedback } from "@/lib/ai/classifier";
import { storeFeedbackClassification } from "@/lib/ai/store-classification";

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
        { message: "Forbidden. Only Admin or Analyst can classify feedback." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const limit = Math.min(Number(body.limit || 10), 20);

    const pendingFeedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId: currentUser.workspaceId,
        sentiment: "NEU",
        sentimentScore: 0,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    let classified = 0;
    let failed = 0;

    for (const feedback of pendingFeedbacks) {
      try {
        const classification = await classifyFeedback(feedback.content);

        await prisma.$transaction((tx) =>
          storeFeedbackClassification(
            tx,
            feedback.id,
            currentUser.workspaceId,
            classification
          )
        );

        classified++;
      } catch (error) {
        console.log("CLASSIFY_PENDING_ITEM_ERROR:", error);
        failed++;
      }
    }

    return NextResponse.json(
      {
        message: "Pending feedback classification completed.",
        total: pendingFeedbacks.length,
        classified,
        failed,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("CLASSIFY_PENDING_ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Pending classification failed." },
      { status: 500 }
    );
  }
}
