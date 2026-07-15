export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { FeedbackChannel, FeedbackStatus, Sentiment } from "@prisma/client";
import { prisma } from "@/lib/db";
import { canManageFeedback, getCurrentUser } from "@/lib/auth";

const simulatedItems = [
  "The onboarding checklist helped but the setup instructions need to be clearer.",
  "Payment failed during checkout and the retry button was not visible.",
  "The support team solved my issue but response time was slow.",
  "The mobile dashboard is hard to use on small screens.",
  "I like the analytics page because it shows sentiment clearly.",
  "The invoice download option is difficult to find.",
  "Search works well but filtering by status should be faster.",
  "The app-store review flow feels confusing for new users.",
  "Customers are asking for a simpler onboarding video.",
  "The dashboard cards are useful for quick decision making.",
];

export async function POST() {
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
        { message: "Forbidden. Only Admin or Analyst can pull simulated feedback." },
        { status: 403 }
      );
    }

    const created = await Promise.all(
      simulatedItems.map((content, index) =>
        prisma.feedback.create({
          data: {
            content,
            channel: index % 2 === 0 ? FeedbackChannel.SUPPORT : FeedbackChannel.APP_STORE,
            sourceRef: `simulated-channel-${Date.now()}-${index}`,
            customerLabel: `Simulated Customer ${index + 1}`,
            sentiment:
              index % 3 === 0
                ? Sentiment.NEG
                : index % 3 === 1
                ? Sentiment.POS
                : Sentiment.NEU,
            sentimentScore:
              index % 3 === 0 ? -0.62 : index % 3 === 1 ? 0.68 : 0.05,
            status: FeedbackStatus.NEW,
            workspaceId: currentUser.workspaceId,
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: "Simulated channel feedback imported successfully.",
        imported: created.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("SIMULATED_IMPORT_ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Simulated import failed." },
      { status: 500 }
    );
  }
}
