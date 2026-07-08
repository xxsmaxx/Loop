import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { connectDB } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { message: "Question is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { message: "Gemini API key missing" },
        { status: 500 }
      );
    }

    await connectDB();

    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const feedbackText = feedbacks
      .map(
        (item: any, index: number) =>
          `${index + 1}. Company: ${item.company}, Customer: ${item.customer}, Feedback: ${item.feedback}, Sentiment: ${item.sentiment}, Status: ${item.status}`
      )
      .join("\n");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are LOOP AI, an AI customer feedback analyst.

User question:
${question}

Recent customer feedback data:
${feedbackText || "No feedback data available"}

Give a short, clear, helpful answer.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json(
      {
        answer: response.text || "No answer generated",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "AI request failed" },
      { status: 500 }
    );
  }
}