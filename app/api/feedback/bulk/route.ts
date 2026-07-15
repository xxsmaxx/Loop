export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { FeedbackChannel, FeedbackStatus, Sentiment } from "@prisma/client";
import { prisma } from "@/lib/db";
import { canManageFeedback, getCurrentUser } from "@/lib/auth";

const csvRowSchema = z.object({
  content: z.string().min(1),
  channel: z.nativeEnum(FeedbackChannel),
  customerLabel: z.string().optional(),
  sourceRef: z.string().optional(),
});

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim().replace(/^"|"$/g, ""));
  return result;
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
        { message: "Forbidden. Only Admin or Analyst can import feedback." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "CSV file is required." },
        { status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { message: "CSV must include header and at least one row." },
        { status: 400 }
      );
    }

    const headers = parseCsvLine(lines[0]).map((item) => item.trim());

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCsvLine(lines[i]);
        const row: Record<string, string> = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });

        const validated = csvRowSchema.parse({
          content: row.content,
          channel: row.channel,
          customerLabel: row.customerLabel,
          sourceRef: row.sourceRef || `csv-row-${i}`,
        });

        await prisma.feedback.create({
          data: {
            content: validated.content,
            channel: validated.channel,
            customerLabel: validated.customerLabel || "CSV Customer",
            sourceRef: validated.sourceRef || `csv-row-${i}`,
            sentiment: Sentiment.NEU,
            sentimentScore: 0,
            status: FeedbackStatus.NEW,
            workspaceId: currentUser.workspaceId,
          },
        });

        imported++;
      } catch {
        failed++;
        errors.push(`Row ${i + 1} failed.`);
      }
    }

    return NextResponse.json(
      {
        message: "CSV import completed.",
        imported,
        failed,
        errors,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("CSV_IMPORT_ERROR:", error);

    return NextResponse.json(
      { message: error.message || "CSV import failed." },
      { status: 500 }
    );
  }
}
