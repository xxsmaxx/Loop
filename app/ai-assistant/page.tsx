"use client";

import Sidebar from "../../components/dashboard/Sidebar";
import TopBar from "../../components/dashboard/TopBar";
import { Bot, Send, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIAssistantPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "user",
      text: "What are the main customer complaints this week?",
    },
    {
      role: "ai",
      text: "Most complaints are related to payment failures, slow app performance, and onboarding confusion.",
    },
  ]);

  async function askAI(e: FormEvent) {
    e.preventDefault();

    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userQuestion },
    ]);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer || data.message || "AI could not answer.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <section className="flex-1 px-8 py-8">
        <TopBar />

        <p className="text-sm text-blue-400">LOOP AI</p>

        <h1 className="mt-2 text-4xl font-bold">
          AI Feedback Assistant
        </h1>

        <p className="mt-3 text-slate-400">
          Ask AI to summarize feedback, find issues, and suggest improvements.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-500/20 p-4 text-purple-300">
                <Bot className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Chat with LOOP AI</h2>
                <p className="text-sm text-slate-400">
                  Real Gemini AI connected with your feedback data
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.role === "user"
                      ? "max-w-2xl rounded-2xl bg-slate-950 p-4 text-sm text-slate-200"
                      : "ml-auto max-w-2xl rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm leading-6 text-slate-200"
                  }
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="ml-auto max-w-2xl rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-300">
                  LOOP AI is thinking...
                </div>
              )}
            </div>

            <form
              onSubmit={askAI}
              className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask LOOP AI anything..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="submit"
                className="rounded-xl bg-blue-600 p-3 hover:bg-blue-500"
              >
                <Send className="h-5 w-5 text-white" />
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-yellow-400" />
              <h2 className="text-2xl font-bold">AI Suggestions</h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-950 p-4 text-sm">
                Ask: What is the biggest customer issue?
              </div>

              <div className="rounded-xl bg-slate-950 p-4 text-sm">
                Ask: Which feedback needs urgent action?
              </div>

              <div className="rounded-xl bg-slate-950 p-4 text-sm">
                Ask: Give me improvement suggestions.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}