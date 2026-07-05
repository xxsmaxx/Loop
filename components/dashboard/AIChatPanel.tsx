import { Bot, Send } from "lucide-react";

export default function AIChatPanel() {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-purple-500/20 p-3 text-purple-300">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Ask LOOP AI</h2>
          <p className="text-sm text-slate-400">Ask questions about customer feedback</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="max-w-xl rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
          Why are users unhappy this week?
        </div>

        <div className="ml-auto max-w-xl rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 text-sm text-slate-200">
          Most negative feedback is related to payment failures, delayed onboarding, and checkout reliability.
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
        <input
          placeholder="Ask LOOP AI..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
        <button className="rounded-xl bg-blue-600 p-3 hover:bg-blue-500">
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}