"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { Bot, Loader2, MessageSquare, Send, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

type Source = {
  ref: string;
  id: string;
  content: string;
  customerLabel: string;
  channel: string;
  sentiment: string;
  featureArea: string;
  themes: string[];
  createdAt: string;
};

const sampleQuestions = [
  "What are customers complaining about most?",
  "Why are payment users unhappy?",
  "Summarize support quality issues.",
  "Which themes are increasing in negative feedback?",
];

export default function AiAssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function askLoop(e?: FormEvent, customQuestion?: string) {
    e?.preventDefault();

    const finalQuestion = customQuestion || question;

    if (!finalQuestion.trim()) {
      setMessage("Please type a question.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setAnswer("");
      setSources([]);

      const res = await fetch("/api/ask-loop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: finalQuestion,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Ask LOOP failed.");
        return;
      }

      setQuestion(finalQuestion);
      setAnswer(data.answer || "");
      setSources(data.sources || []);
    } catch {
      setMessage("Ask LOOP failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <TopBar />

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-400">AI Assistant</p>
          <h1 className="mt-2 text-4xl font-bold">Ask LOOP</h1>
          <p className="mt-3 max-w-3xl text-slate-400">
            Ask questions about customer feedback. Answers are grounded in your workspace
            feedback records and include source citations.
          </p>
        </div>

        <section className="mb-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ask a grounded question</h2>
              <p className="text-sm text-slate-400">
                Example: What are the top complaints in payment feedback?
              </p>
            </div>
          </div>

          {message && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {message}
            </div>
          )}

          <form onSubmit={(e) => askLoop(e)} className="flex flex-col gap-3 md:flex-row">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask LOOP anything about feedback..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none placeholder:text-slate-500"
            />

            <button
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              Ask
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {sampleQuestions.map((item) => (
              <button
                key={item}
                onClick={() => askLoop(undefined, item)}
                disabled={loading}
                className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300 hover:border-blue-500 hover:text-blue-300 disabled:opacity-50"
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <section className="rounded-2xl border border-white/10 bg-[#111827] p-8 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-400" />
            <p className="text-slate-400">Ask LOOP is reading feedback evidence...</p>
          </section>
        )}

        {!loading && answer && (
          <section className="mb-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="mb-4 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <h2 className="text-2xl font-bold">Answer</h2>
            </div>

            <div className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950 p-5 leading-7 text-slate-200">
              {answer}
            </div>
          </section>
        )}

        {!loading && sources.length > 0 && (
          <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="mb-5 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-300" />
              <h2 className="text-2xl font-bold">Feedback Sources</h2>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {sources.slice(0, 8).map((source) => (
                <div
                  key={source.id}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                      {source.ref}
                    </span>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {source.channel}
                    </span>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {source.sentiment}
                    </span>
                  </div>

                  <p className="mb-2 text-sm font-semibold text-white">
                    {source.customerLabel} · {source.featureArea}
                  </p>

                  <p className="line-clamp-4 text-sm leading-6 text-slate-400">
                    {source.content}
                  </p>

                  {source.themes.length > 0 && (
                    <p className="mt-3 text-xs text-slate-500">
                      Themes: {source.themes.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
