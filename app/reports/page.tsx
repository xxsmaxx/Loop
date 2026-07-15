"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import {
  Download,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type ReportContent = {
  executiveSummary: string;
  topPainPoints: string[];
  topWins: string[];
  recommendedActions: string[];
  customerQuotes: string[];
};

type Report = {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  contentJson: ReportContent;
  createdAt: string;
  generatedBy?: {
    name: string;
    email: string;
    role: string;
  };
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [title, setTitle] = useState("Monthly Voice of Customer Report");
  const [days, setDays] = useState("30");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/reports");
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to load reports.");
        return;
      }

      setReports(data.reports || []);
    } catch {
      setMessage("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  async function generateReport(e: FormEvent) {
    e.preventDefault();

    try {
      setGenerating(true);
      setMessage("");

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          days: Number(days),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Report generation failed.");
        return;
      }

      setMessage("VoC report generated and saved successfully.");
      await loadReports();
    } catch {
      setMessage("Report generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  function downloadReport(report: Report) {
    const content = report.contentJson;

    const text = `
${report.title}

Period:
${new Date(report.periodStart).toLocaleDateString()} - ${new Date(report.periodEnd).toLocaleDateString()}

Executive Summary:
${content.executiveSummary}

Top Pain Points:
${content.topPainPoints.map((item, index) => `${index + 1}. ${item}`).join("\n")}

Top Wins:
${content.topWins.map((item, index) => `${index + 1}. ${item}`).join("\n")}

Recommended Actions:
${content.recommendedActions.map((item, index) => `${index + 1}. ${item}`).join("\n")}

Customer Quotes:
${content.customerQuotes.map((item, index) => `${index + 1}. ${item}`).join("\n")}
`;

    const blob = new Blob([text.trim()], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${report.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <TopBar />

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-blue-400">Voice of Customer</p>
            <h1 className="mt-2 text-4xl font-bold">VoC Reports</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              Generate, save, and export Voice of Customer reports from workspace feedback.
            </p>
          </div>

          <button
            onClick={loadReports}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white hover:bg-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-200">
            {message}
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20 text-yellow-300">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Generate VoC Report</h2>
              <p className="text-sm text-slate-400">
                AI will summarize pain points, wins, and recommended actions.
              </p>
            </div>
          </div>

          <form onSubmit={generateReport} className="grid gap-4 md:grid-cols-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Report title"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 md:col-span-2"
            />

            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 1 year</option>
            </select>

            <button
              disabled={generating}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-3"
            >
              {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
              {generating ? "Generating..." : "Generate & Save Report"}
            </button>
          </form>
        </section>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 text-center text-slate-400">
            Loading reports...
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 text-center text-slate-400">
            No saved reports found. Generate your first VoC report.
          </div>
        )}

        {!loading && reports.length > 0 && (
          <div className="space-y-6">
            {reports.map((report) => (
              <section
                key={report.id}
                className="rounded-2xl border border-white/10 bg-[#111827] p-6"
              >
                <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{report.title}</h2>
                    <p className="mt-2 text-sm text-slate-400">
                      {new Date(report.periodStart).toLocaleDateString()} -{" "}
                      {new Date(report.periodEnd).toLocaleDateString()} · Generated by{" "}
                      {report.generatedBy?.name || "User"}
                    </p>
                  </div>

                  <button
                    onClick={() => downloadReport(report)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-500"
                  >
                    <Download className="h-4 w-4" />
                    Export TXT
                  </button>
                </div>

                <div className="mb-5 rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <h3 className="mb-2 font-semibold text-blue-300">Executive Summary</h3>
                  <p className="leading-7 text-slate-300">
                    {report.contentJson.executiveSummary}
                  </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <h3 className="mb-3 font-semibold text-red-300">Top Pain Points</h3>
                    <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
                      {report.contentJson.topPainPoints.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <h3 className="mb-3 font-semibold text-emerald-300">Top Wins</h3>
                    <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
                      {report.contentJson.topWins.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <h3 className="mb-3 font-semibold text-yellow-300">Recommended Actions</h3>
                    <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
                      {report.contentJson.recommendedActions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {report.contentJson.customerQuotes.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <h3 className="mb-3 font-semibold text-purple-300">Customer Quotes</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {report.contentJson.customerQuotes.map((item, index) => (
                        <blockquote
                          key={index}
                          className="rounded-xl border border-white/10 bg-[#111827] p-4 text-sm leading-6 text-slate-300"
                        >
                          “{item}”
                        </blockquote>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
