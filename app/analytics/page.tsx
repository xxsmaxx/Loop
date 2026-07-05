import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import SentimentPieChart from "@/components/dashboard/SentimentPieChart";

export default function AnalyticsPage() {
  return (
    <main className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <section className="flex-1 px-8 py-8">
        <TopBar />

        <div className="mt-8">
          <p className="text-sm text-blue-400">LOOP Analytics</p>

          <h1 className="mt-2 text-4xl font-bold">
            Feedback Analytics
          </h1>

          <p className="mt-3 text-slate-400">
            Analyze feedback trends, sentiment distribution, and customer behavior.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <AnalyticsChart />
          <SentimentPieChart />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <p className="text-sm text-slate-400">Top Theme</p>
            <h2 className="mt-2 text-2xl font-bold">Payment Issues</h2>
            <p className="mt-2 text-sm text-red-400">23% increase</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <p className="text-sm text-slate-400">Best Feedback</p>
            <h2 className="mt-2 text-2xl font-bold">Dashboard UI</h2>
            <p className="mt-2 text-sm text-emerald-400">Highly positive</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <p className="text-sm text-slate-400">Action Needed</p>
            <h2 className="mt-2 text-2xl font-bold">Onboarding</h2>
            <p className="mt-2 text-sm text-yellow-400">Needs improvement</p>
          </div>
        </div>
      </section>
    </main>
  );
}