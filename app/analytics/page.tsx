"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import {
  Activity,
  BarChart3,
  MessageSquare,
  RefreshCw,
  TrendingDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AnalyticsData = {
  stats: {
    total: number;
    negativePercent: number;
    newThisWeek: number;
    positive: number;
    neutral: number;
    negative: number;
  };
  volumeOverTime: {
    date: string;
    count: number;
  }[];
  sentimentBreakdown: {
    name: string;
    value: number;
  }[];
  topThemes: {
    theme: string;
    count: number;
  }[];
};

const sentimentColors = ["#22c55e", "#64748b", "#ef4444"];

export default function AnalyticsPage() {
  const [days, setDays] = useState("30");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`/api/analytics?days=${days}`);
      const result = await res.json();

      if (!res.ok) {
        setMessage(result.message || "Failed to load analytics.");
        return;
      }

      setData(result);
    } catch {
      setMessage("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const hasData = data && data.stats.total > 0;

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <TopBar />

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-blue-400">LOOP Analytics</p>
            <h1 className="mt-2 text-4xl font-bold">Feedback Analytics</h1>
            <p className="mt-3 text-slate-400">
              Real dashboard generated from PostgreSQL feedback data.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 text-white outline-none"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 1 year</option>
            </select>

            <button
              onClick={loadAnalytics}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {message}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 text-center text-slate-400">
            Loading analytics...
          </div>
        )}

        {!loading && !hasData && (
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 text-center text-slate-400">
            No feedback data found for this date range.
          </div>
        )}

        {!loading && hasData && data && (
          <>
            <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <p className="text-sm text-slate-400">Total Feedback</p>
                <h2 className="mt-2 text-3xl font-bold">{data.stats.total}</h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-300">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <p className="text-sm text-slate-400">Negative %</p>
                <h2 className="mt-2 text-3xl font-bold">{data.stats.negativePercent}%</h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-300">
                  <Activity className="h-6 w-6" />
                </div>
                <p className="text-sm text-slate-400">New This Week</p>
                <h2 className="mt-2 text-3xl font-bold">{data.stats.newThisWeek}</h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <p className="text-sm text-slate-400">Top Theme</p>
                <h2 className="mt-2 text-2xl font-bold">
                  {data.topThemes[0]?.theme || "N/A"}
                </h2>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <h2 className="mb-5 text-2xl font-bold">Volume Over Time</h2>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.volumeOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          background: "#020617",
                          border: "1px solid #334155",
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#38bdf8"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <h2 className="mb-5 text-2xl font-bold">Sentiment Breakdown</h2>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.sentimentBreakdown}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        label
                      >
                        {data.sentimentBreakdown.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={sentimentColors[index % sentimentColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#020617",
                          border: "1px solid #334155",
                          color: "#fff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#111827] p-6 xl:col-span-2">
                <h2 className="mb-5 text-2xl font-bold">Top Themes</h2>
                <div className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.topThemes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="theme" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          background: "#020617",
                          border: "1px solid #334155",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
