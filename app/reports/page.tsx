import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { Download, FileText, TrendingUp, AlertCircle } from "lucide-react";

const reports = [
  {
    title: "Weekly Feedback Report",
    desc: "Summary of feedback trends and customer issues.",
    date: "Jul 06, 2026",
    status: "Ready",
  },
  {
    title: "Sentiment Analysis Report",
    desc: "Positive, negative, and neutral feedback breakdown.",
    date: "Jul 05, 2026",
    status: "Ready",
  },
  {
    title: "Customer Risk Report",
    desc: "Feedback items requiring urgent attention.",
    date: "Jul 04, 2026",
    status: "Review",
  },
];

export default function ReportsPage() {
  return (
    <main className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <section className="flex-1 px-8 py-8">
        <TopBar />

        <div className="mt-8">
          <p className="text-sm text-blue-400">LOOP Reports</p>

          <h1 className="mt-2 text-4xl font-bold">Reports Center</h1>

          <p className="mt-3 text-slate-400">
            Generate and download customer feedback intelligence reports.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <FileText className="h-8 w-8 text-blue-400" />
            <p className="mt-5 text-sm text-slate-400">Total Reports</p>
            <h2 className="mt-2 text-3xl font-bold">24</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <TrendingUp className="h-8 w-8 text-emerald-400" />
            <p className="mt-5 text-sm text-slate-400">Generated This Month</p>
            <h2 className="mt-2 text-3xl font-bold">8</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <AlertCircle className="h-8 w-8 text-yellow-400" />
            <p className="mt-5 text-sm text-slate-400">Reports In Review</p>
            <h2 className="mt-2 text-3xl font-bold">3</h2>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Reports</h2>

            <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500">
              Generate Report
            </button>
          </div>

          <div className="space-y-4">
            {reports.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                  <p className="mt-2 text-xs text-slate-500">{item.date}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                    {item.status}
                  </span>

                  <button className="rounded-xl bg-slate-800 p-3 hover:bg-blue-600">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}