import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export async function GET() {
  try {
    await connectDB();

    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch feedbacks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { company, customer, feedback, sentiment, status, userEmail } =
      await req.json();

    if (!company || !customer || !feedback || !userEmail) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }

    await connectDB();

    const newFeedback = await Feedback.create({
      company,
      customer,
      feedback,
      sentiment,
      status,
      userEmail,
    });

    return NextResponse.json(
      {
        message: "Feedback added successfully",
        feedback: newFeedback,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to add feedback" },
      { status: 500 }
    );
  }
}
