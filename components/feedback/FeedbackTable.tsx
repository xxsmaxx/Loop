"use client";

import { useEffect, useState } from "react";

type Feedback = {
  _id: string;
  company: string;
  customer: string;
  feedback: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  status: "Open" | "Closed" | "Review";
  userEmail: string;
  createdAt: string;
};

export default function FeedbackTable() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [company, setCompany] = useState("");
  const [customer, setCustomer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sentiment, setSentiment] = useState("Neutral");
  const [status, setStatus] = useState("Open");

  async function fetchFeedbacks() {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      console.log("Failed to fetch feedbacks", error);
    } finally {
      setLoading(false);
    }
  }

 async function saveFeedback(e: React.FormEvent) {
  e.preventDefault();

  const savedUser = localStorage.getItem("loopUser");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const url = editingId ? `/api/feedback/${editingId}` : "/api/feedback";
  const method = editingId ? "PATCH" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company,
      customer,
      feedback,
      sentiment,
      status,
      userEmail: user?.email || "demo@gmail.com",
    }),
  });

  const text = await res.text();
  let data: any = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (res.ok) {
    alert(editingId ? "Feedback updated successfully" : "Feedback added successfully");

    setCompany("");
    setCustomer("");
    setFeedback("");
    setSentiment("Neutral");
    setStatus("Open");
    setEditingId(null);
    fetchFeedbacks();
  } else {
    alert(data.message || `Error: ${res.status}`);
  }
}
  function startEdit(item: Feedback) {
    setEditingId(item._id);
    setCompany(item.company);
    setCustomer(item.customer);
    setFeedback(item.feedback);
    setSentiment(item.sentiment);
    setStatus(item.status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteFeedback(id: string) {
    const confirmDelete = confirm("Are you sure you want to delete this feedback?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/feedback/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchFeedbacks();
    }
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filteredFeedbacks = feedbacks.filter((item) => {
    return (
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.feedback.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="mt-8 space-y-8">
      <form
        onSubmit={saveFeedback}
        className="rounded-2xl border border-white/10 bg-[#111827] p-6"
      >
        <h2 className="text-xl font-bold text-white">
          {editingId ? "Update Feedback" : "Add New Feedback"}
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            required
          />

          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Customer name"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            required
          />

          <input
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Feedback message"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            required
          />

          <select
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
          >
            <option>Positive</option>
            <option>Negative</option>
            <option>Neutral</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
          >
            <option>Open</option>
            <option>Closed</option>
            <option>Review</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {editingId ? "Update Feedback" : "Save Feedback"}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">All Feedback</h2>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback..."
            className="w-80 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
          />
        </div>

        {loading ? (
          <p className="text-slate-400">Loading feedback...</p>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-slate-700 text-sm text-slate-400">
              <tr>
                <th className="pb-3">Company</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Feedback</th>
                <th className="pb-3">Sentiment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredFeedbacks.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-slate-800 hover:bg-slate-800/40"
                >
                  <td className="py-4 text-white">{item.company}</td>
                  <td className="py-4 text-slate-300">{item.customer}</td>
                  <td className="py-4 text-slate-300">{item.feedback}</td>

                  <td
                    className={
                      item.sentiment === "Positive"
                        ? "py-4 font-semibold text-emerald-400"
                        : item.sentiment === "Negative"
                        ? "py-4 font-semibold text-red-400"
                        : "py-4 font-semibold text-blue-400"
                    }
                  >
                    {item.sentiment}
                  </td>

                  <td className="py-4">
                    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
                      {item.status}
                    </span>
                  </td>

                  <td className="py-4 text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="rounded-lg bg-blue-500/20 px-3 py-1 text-xs text-blue-400 hover:bg-blue-600 hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteFeedback(item._id)}
                        className="rounded-lg bg-red-500/20 px-3 py-1 text-xs text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}