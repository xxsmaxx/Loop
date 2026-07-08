import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return NextResponse.json(
        { message: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Feedback deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete feedback" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { company, customer, feedback, sentiment, status } = await req.json();

    await connectDB();

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { company, customer, feedback, sentiment, status },
      { new: true }
    );

    if (!updatedFeedback) {
      return NextResponse.json(
        { message: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Feedback updated successfully",
        feedback: updatedFeedback,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update feedback" },
      { status: 500 }
    );
  }
}
