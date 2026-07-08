import { connectDB } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export async function GET() {
  await connectDB();

  const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();

  const headers = ["Company", "Customer", "Feedback", "Sentiment", "Status", "Date"];

  const rows = feedbacks.map((item: any) => [
    item.company,
    item.customer,
    item.feedback,
    item.sentiment,
    item.status,
    new Date(item.createdAt).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=loop-feedback-report.csv",
    },
  });
}