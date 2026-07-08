"use client";

import { Bot, Send } from "lucide-react";
import { FormEvent, useState } from "react";

export default function AIChatPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Most negative feedback is related to payment failures, delayed onboarding, and checkout reliability."
  );
  const [loading, setLoading] = useState(false);

  async function askAI(e: FormEvent) {
    e.preventDefault();

    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (res.ok) {
        setAnswer(data.answer || "No answer generated.");
      } else {
        setAnswer(data.message || "AI request failed.");
      }

      setQuestion("");
    } catch {
      setAnswer("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-purple-500/20 p-3 text-purple-300">
          <Bot className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Ask LOOP AI</h2>
          <p className="text-sm text-slate-400">
            Ask questions about customer feedback
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="max-w-xl rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
          {question || "Why are users unhappy this week?"}
        </div>

        <div className="ml-auto max-w-xl rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 text-sm leading-6 text-slate-200">
          {loading ? "LOOP AI is thinking..." : answer}
        </div>
      </div>

      <form
        onSubmit={askAI}
        className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
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
          <Send className="h-4 w-4 text-white" />
        </button>
      </form>
    </div>
  );
}