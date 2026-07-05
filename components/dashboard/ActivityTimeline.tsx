const activities = [
  { title: "Amazon submitted new feedback", time: "2 min ago", color: "bg-green-400" },
  { title: "AI sentiment analysis completed", time: "8 min ago", color: "bg-blue-400" },
  { title: "Payment issue detected", time: "14 min ago", color: "bg-red-400" },
  { title: "Weekly report generated", time: "30 min ago", color: "bg-purple-400" },
];

export default function ActivityTimeline() {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
      <h2 className="text-xl font-bold text-white">Activity Timeline</h2>

      <div className="mt-6 space-y-5">
        {activities.map((item) => (
          <div key={item.title} className="flex gap-4">
            <div className={`mt-1 h-3 w-3 rounded-full ${item.color}`} />
            <div>
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs text-slate-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}