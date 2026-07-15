import { Prisma } from "@prisma/client";
import type { ClassificationResult } from "@/lib/ai/classifier";

export async function storeFeedbackClassification(
  tx: Prisma.TransactionClient,
  feedbackId: string,
  workspaceId: string,
  result: ClassificationResult
) {
  await tx.feedbackTheme.deleteMany({
    where: {
      feedbackId,
    },
  });

  await tx.feedback.update({
    where: {
      id: feedbackId,
    },
    data: {
      sentiment: result.sentiment,
      sentimentScore: result.sentimentScore,
      featureArea: result.featureArea,
    },
  });

  for (const item of result.themes) {
    const theme = await tx.theme.upsert({
      where: {
        workspaceId_name: {
          workspaceId,
          name: item.name,
        },
      },
      update: {
        description: `AI detected theme: ${item.name}`,
      },
      create: {
        workspaceId,
        name: item.name,
        description: `AI detected theme: ${item.name}`,
      },
    });

    await tx.feedbackTheme.create({
      data: {
        feedbackId,
        themeId: theme.id,
        confidence: item.confidence,
      },
    });
  }

  return tx.feedback.findUnique({
    where: {
      id: feedbackId,
    },
    include: {
      feedbackThemes: {
        include: {
          theme: true,
        },
      },
    },
  });
}
