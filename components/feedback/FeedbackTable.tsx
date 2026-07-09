"use client";

import { Edit, Eye, Plus, Search, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type FeedbackItem = {
  _id: string;
  company: string;
  customer: string;
  feedback: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  status: "Open" | "Closed" | "Review";
  userEmail: string;
  createdAt?: string;
};

const emptyForm = {
  company: "",
  customer: "",
  feedback: "",
  sentiment: "Neutral",
  status: "Open",
  userEmail: "",
};

export default function FeedbackTable() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

  const [user, setUser] = useState({
    name: "User",
    email: "",
    role: "User",
  });

  const isAdmin = user.role === "Admin";

  useEffect(() => {
    const savedUser = localStorage.getItem("loopUser");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      setUser({
        name: parsedUser.name || "User",
        email: parsedUser.email || "",
        role: parsedUser.role || "User",
      });

      setForm((prev) => ({
        ...prev,
        userEmail: parsedUser.email || "",
      }));
    }

    fetchFeedbacks();
  }, []);

  async function fetchFeedbacks() {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();

      if (res.ok) {
        setFeedbacks(data.feedbacks || []);
      }
    } catch {
      setMessage("Failed to load feedback.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("loopToken") || "";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (editingId) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(
        editingId ? `/api/feedback/${editingId}` : "/api/feedback",
        {
          method: editingId ? "PATCH" : "POST",
          headers,
          body: JSON.stringify({
            ...form,
            userEmail: user.email || form.userEmail || "guest@loop.ai",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      setMessage(editingId ? "Feedback updated successfully." : "Feedback added successfully.");
      setForm({
        ...emptyForm,
        userEmail: user.email,
      });
      setEditingId(null);
      fetchFeedbacks();
    } catch {
      setMessage("Something went wrong.");
    }
  }

  function startEdit(item: FeedbackItem) {
    if (!isAdmin) {
      setMessage("Only admin can edit feedback.");
      return;
    }

    setEditingId(item._id);

    setForm({
      company: item.company,
      customer: item.customer,
      feedback: item.feedback,
      sentiment: item.sentiment,
      status: item.status,
      userEmail: item.userEmail,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!isAdmin) {
      setMessage("Only admin can delete feedback.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("loopToken") || "";

      const res = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  function cancelEdit() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      userEmail: user.email,
    });
  }

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      const text = `${item.company} ${item.customer} ${item.feedback} ${item.sentiment} ${item.status}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [feedbacks, search]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editingId ? "Edit Feedback" : "Add Feedback"}
            </h2>
            <p className="text-sm text-slate-400">
              Logged in as {user.role}.{" "}
              {isAdmin
                ? "Admin can view, edit and delete feedback."
                : "User can add, view and search feedback."}
            </p>
          </div>

          {editingId && (
            <button
              onClick={cancelEdit}
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Company name"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            required
          />

          <input
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
            placeholder="Customer name"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            required
          />

          <select
            value={form.sentiment}
            onChange={(e) => setForm({ ...form, sentiment: e.target.value })}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          >
            <option>Positive</option>
            <option>Negative</option>
            <option>Neutral</option>
          </select>

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          >
            <option>Open</option>
            <option>Closed</option>
            <option>Review</option>
          </select>

          <textarea
            value={form.feedback}
            onChange={(e) => setForm({ ...form, feedback: e.target.value })}
            placeholder="Write customer feedback..."
            className="min-h-28 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 md:col-span-2"
            required
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 md:col-span-2"
          >
            <Plus className="h-5 w-5" />
            {editingId ? "Update Feedback" : "Add Feedback"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Feedback Records</h2>
            <p className="text-sm text-slate-400">
              {isAdmin
                ? "Admin mode: view/edit/delete enabled."
                : "User mode: view only. Edit/delete disabled."}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback..."
              className="bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3">Company</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Feedback</th>
                <th className="py-3">Sentiment</th>
                <th className="py-3">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredFeedbacks.map((item) => (
                <tr key={item._id} className="border-b border-white/5 text-slate-300">
                  <td className="py-4 font-medium text-white">{item.company}</td>
                  <td className="py-4">{item.customer}</td>
                  <td className="max-w-md py-4">{item.feedback}</td>
                  <td className="py-4">{item.sentiment}</td>
                  <td className="py-4">{item.status}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedFeedback(item)}
                        className="rounded-lg bg-blue-500/20 p-2 text-blue-300 hover:bg-blue-500 hover:text-white"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => startEdit(item)}
                            className="rounded-lg bg-yellow-500/20 p-2 text-yellow-300 hover:bg-yellow-500 hover:text-white"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="rounded-lg bg-red-500/20 p-2 text-red-300 hover:bg-red-500 hover:text-white"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredFeedbacks.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No feedback found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {filteredFeedbacks.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-white/10 bg-slate-950 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{item.company}</h3>
                  <p className="text-sm text-slate-400">{item.customer}</p>
                </div>

                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                  {item.status}
                </span>
              </div>

              <p className="mb-3 text-sm leading-6 text-slate-300">
                {item.feedback}
              </p>

              <p className="mb-4 text-sm text-slate-400">
                Sentiment: <span className="text-white">{item.sentiment}</span>
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFeedback(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => startEdit(item)}
                      className="rounded-xl bg-yellow-500/20 px-4 py-3 text-yellow-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-xl bg-red-500/20 px-4 py-3 text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedFeedback && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Feedback Details
                </h2>
                <p className="text-sm text-slate-400">
                  Full customer feedback information
                </p>
              </div>

              <button
                onClick={() => setSelectedFeedback(null)}
                className="rounded-xl bg-slate-800 p-2 text-white hover:bg-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-slate-400">
                Company: <span className="text-white">{selectedFeedback.company}</span>
              </p>
              <p className="text-slate-400">
                Customer: <span className="text-white">{selectedFeedback.customer}</span>
              </p>
              <p className="text-slate-400">
                Sentiment: <span className="text-white">{selectedFeedback.sentiment}</span>
              </p>
              <p className="text-slate-400">
                Status: <span className="text-white">{selectedFeedback.status}</span>
              </p>
              <div>
                <p className="mb-2 text-slate-400">Feedback:</p>
                <p className="rounded-xl bg-slate-950 p-4 leading-6 text-white">
                  {selectedFeedback.feedback}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedFeedback(null)}
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
