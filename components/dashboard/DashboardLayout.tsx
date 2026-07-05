import FeedbackTable from "./FeedbackTable";
import AnalyticsChart from "./AnalyticsChart";

export default function DashboardLayout() {
  const stats = [
    { title: "Total Feedback", value: "12,847", change: "+18%", color: "from-blue-500 to-cyan-400" },
    { title: "Positive Sentiment", value: "74%", change: "+6%", color: "from-emerald-500 to-lime-400" },
    { title: "AI Themes", value: "38", change: "+12", color: "from-purple-500 to-pink-400" },
    { title: "Risk Alerts", value: "7", change: "-2", color: "from-orange-500 to-red-400" },
  ];

  return (
    <section className="mt-8">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-lg">
            <div className={`mb-5 h-12 w-12 rounded-xl bg-gradient-to-r ${item.color}`} />
            <p className="text-sm text-slate-400">{item.title}</p>
            <h3 className="mt-2 text-3xl font-bold text-white">{item.value}</h3>
            <p className="mt-2 text-sm text-emerald-400">{item.change} this month</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-xl font-bold text-white">AI Insight</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Customers are talking more about onboarding speed, payment reliability, and dashboard performance this week.
          </p>
          <div className="mt-6 space-y-3">
            <div className="rounded-xl bg-slate-950 p-3 text-sm text-slate-300">Payment issues increased by 23%</div>
            <div className="rounded-xl bg-slate-950 p-3 text-sm text-slate-300">Dashboard feedback is positive</div>
            <div className="rounded-xl bg-slate-950 p-3 text-sm text-slate-300">Onboarding needs improvement</div>
          </div>
        </div>
      </div>

      <FeedbackTable />
    </section>
  );
}