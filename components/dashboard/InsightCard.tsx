import { Bot } from "lucide-react";

export default function InsightCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white backdrop-blur">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-purple-400" />
        <h2 className="text-lg font-semibold">AI Insight</h2>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-300">
        Users are frequently mentioning onboarding speed, payment reliability,
        and dashboard performance this week.
      </p>

      <div className="mt-5 space-y-3">
        <div className="rounded-xl bg-slate-950/80 p-3 text-sm text-slate-300">
          Payment issues increased by 23%
        </div>
        <div className="rounded-xl bg-slate-950/80 p-3 text-sm text-slate-300">
          Dashboard feedback is mostly positive
        </div>
      </div>
    </div>
  );
}