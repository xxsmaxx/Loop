import { Clock } from "lucide-react";

const activities = [
  "New feedback received from Amazon",
  "AI generated weekly report",
  "Payment issue detected",
  "Sentiment analysis completed",
];

export default function ActivityCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white backdrop-blur">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-cyan-400" />
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>

      <div className="mt-5 space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-300"
          >
            {activity}
          </div>
        ))}
      </div>
    </div>
  );
}