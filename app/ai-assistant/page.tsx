import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { Bot, Send, Sparkles } from "lucide-react";

export default function AIAssistantPage() {
  return (
    <main className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <section className="flex-1 px-8 py-8">
        <TopBar />

        <div className="mt-8">
          <p className="text-sm text-blue-400">LOOP AI</p>

          <h1 className="mt-2 text-4xl font-bold">
            AI Feedback Assistant
          </h1>

          <p className="mt-3 text-slate-400">
            Ask AI to summarize feedback, find issues, and suggest improvements.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/20 p-3 text-purple-300">
                <Bot className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold">Chat with LOOP AI</h2>
                <p className="text-sm text-slate-400">
                  Customer feedback intelligence assistant
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div className="max-w-xl rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
                What are the main customer complaints this week?
              </div>

              <div className="ml-auto max-w-xl rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-slate-200">
                Most complaints are related to payment failures, slow app performance,
                and onboarding confusion.
              </div>

              <div className="max-w-xl rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
                Give me one improvement suggestion.
              </div>

              <div className="ml-auto max-w-xl rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-slate-200">
                Improve checkout reliability and add a clearer onboarding guide for new users.
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              <input
                placeholder="Ask LOOP AI anything..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button className="rounded-xl bg-blue-600 p-3 hover:bg-blue-500">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <h2 className="text-xl font-bold">AI Suggestions</h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
                Fix payment failure issue first.
              </div>

              <div className="rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
                Improve dashboard loading speed.
              </div>

              <div className="rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
                Add onboarding tutorial for new users.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}