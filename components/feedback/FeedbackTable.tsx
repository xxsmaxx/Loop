"use client";

import { ChevronLeft, ChevronRight, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { getSession } from "next-auth/react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Role = "ADMIN" | "ANALYST" | "VIEWER";
type Channel = "SUPPORT" | "APP_STORE" | "SURVEY" | "SALES" | "SOCIAL" | "CHAT";
type Sentiment = "POS" | "NEU" | "NEG";
type Status = "NEW" | "REVIEWED" | "ACTIONED";

type FeedbackItem = {
  id: string;
  content: string;
  channel: Channel;
  sourceRef?: string | null;
  customerLabel?: string | null;
  sentiment: Sentiment;
  sentimentScore: number;
  status: Status;
  featureArea?: string | null;
  createdAt: string;
  feedbackThemes?: {
    theme: {
      name: string;
      color: string;
    };
  }[];
};

const channels: Channel[] = ["SUPPORT", "APP_STORE", "SURVEY", "SALES", "SOCIAL", "CHAT"];
const sentiments: Sentiment[] = ["POS", "NEU", "NEG"];
const statuses: Status[] = ["NEW", "REVIEWED", "ACTIONED"];

export default function FeedbackTable() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [role, setRole] = useState<Role>("VIEWER");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [content, setContent] = useState("");
  const [customerLabel, setCustomerLabel] = useState("");
  const [channel, setChannel] = useState<Channel>("SUPPORT");

  const [search, setSearch] = useState("");
  const [filterChannel, setFilterChannel] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const canManage = role === "ADMIN" || role === "ANALYST";
  const canDelete = role === "ADMIN";

  useEffect(() => {
    async function loadUser() {
      const session = await getSession();
      const sessionRole = ((session?.user as any)?.role || "VIEWER") as Role;
      setRole(sessionRole);
    }

    loadUser();
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [page, filterChannel, filterSentiment, filterStatus]);

  async function fetchFeedbacks() {
    setLoading(true);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (search.trim()) params.set("search", search.trim());
    if (filterChannel) params.set("channel", filterChannel);
    if (filterSentiment) params.set("sentiment", filterSentiment);
    if (filterStatus) params.set("status", filterStatus);

    try {
      const res = await fetch(`/api/feedback?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to load feedback.");
        return;
      }

      setFeedbacks(data.feedbacks || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setMessage("Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!canManage) {
      setMessage("Viewer role is read-only. Only Admin or Analyst can add feedback.");
      return;
    }

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          channel,
          customerLabel,
          sourceRef: "manual-entry",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to add feedback.");
        return;
      }

      setMessage("Feedback added successfully.");
      setContent("");
      setCustomerLabel("");
      setChannel("SUPPORT");
      setPage(1);
      fetchFeedbacks();
    } catch {
      setMessage("Failed to add feedback.");
    }
  }

  async function updateStatus(id: string, status: Status) {
    if (!canManage) {
      setMessage("Viewer role is read-only. Only Admin or Analyst can update status.");
      return;
    }

    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Status update failed.");
        return;
      }

      setMessage("Status updated successfully.");
      fetchFeedbacks();
    } catch {
      setMessage("Status update failed.");
    }
  }

  async function deleteFeedback(id: string) {
    if (!canDelete) {
      setMessage("Only Admin can delete feedback.");
      return;
    }

    const ok = window.confirm("Delete this feedback?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Delete failed.");
        return;
      }

      setMessage("Feedback deleted successfully.");
      fetchFeedbacks();
    } catch {
      setMessage("Delete failed.");
    }
  }

  function applySearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchFeedbacks();
  }

  function resetFilters() {
    setSearch("");
    setFilterChannel("");
    setFilterSentiment("");
    setFilterStatus("");
    setPage(1);
    setTimeout(fetchFeedbacks, 100);
  }

  const roleText = useMemo(() => {
    if (role === "ADMIN") return "Admin can add, update status, and delete feedback.";
    if (role === "ANALYST") return "Analyst can add feedback and update status.";
    return "Viewer can only read feedback.";
  }, [role]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Feedback Ingestion</h2>
            <p className="mt-1 text-sm text-slate-400">
              Role: {role}. {roleText}
            </p>
          </div>

          <button
            onClick={fetchFeedbacks}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
            {message}
          </div>
        )}

        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
          <input
            value={customerLabel}
            onChange={(e) => setCustomerLabel(e.target.value)}
            placeholder="Customer label"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
          />

          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as Channel)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          >
            {channels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write customer feedback..."
            className="min-h-28 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 md:col-span-2"
            required
          />

          <button
            type="submit"
            disabled={!canManage}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
          >
            <Plus className="h-5 w-5" />
            Add Feedback
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-white">Feedback Inbox</h2>
          <p className="mt-1 text-sm text-slate-400">
            Search, filter, paginate, and triage feedback.
          </p>
        </div>

        <form onSubmit={applySearch} className="mb-5 grid gap-3 md:grid-cols-5">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback..."
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          >
            <option value="">All Channels</option>
            {channels.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select
            value={filterSentiment}
            onChange={(e) => setFilterSentiment(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          >
            <option value="">All Sentiment</option>
            {sentiments.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          >
            <option value="">All Status</option>
            {statuses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <button className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500">
            Apply
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Reset
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3">Customer</th>
                <th className="py-3">Content</th>
                <th className="py-3">Channel</th>
                <th className="py-3">Theme</th>
                <th className="py-3">Sentiment</th>
                <th className="py-3">Score</th>
                <th className="py-3">Status</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading feedback...
                  </td>
                </tr>
              )}

              {!loading &&
                feedbacks.map((item) => {
                  const themeNames =
                    item.feedbackThemes?.map((entry) => entry.theme.name).join(", ") ||
                    item.featureArea ||
                    "Unassigned";

                  return (
                    <tr key={item.id} className="border-b border-white/5 text-slate-300">
                      <td className="py-4 font-medium text-white">
                        {item.customerLabel || "Unknown"}
                      </td>
                      <td className="max-w-md py-4 leading-6">{item.content}</td>
                      <td className="py-4">{item.channel}</td>
                      <td className="py-4">{themeNames}</td>
                      <td className="py-4">{item.sentiment}</td>
                      <td className="py-4">{item.sentimentScore.toFixed(2)}</td>
                      <td className="py-4">
                        <select
                          value={item.status}
                          disabled={!canManage}
                          onChange={(e) => updateStatus(item.id, e.target.value as Status)}
                          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none disabled:opacity-60"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => deleteFeedback(item.id)}
                          disabled={!canDelete}
                          className="rounded-lg bg-red-500/20 p-2 text-red-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          title="Only Admin can delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {!loading && feedbacks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No feedback found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <p className="text-sm text-slate-400">
            Page {page} of {totalPages}
          </p>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
