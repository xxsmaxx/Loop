import FeedbackTable from "./FeedbackTable";

export default function FeedbackPage() {
  return (
    <div className="mt-8 text-white">
      <h1 className="text-4xl font-bold">Feedback Management</h1>

      <p className="mt-2 text-slate-400">
        View, filter, and manage customer feedback.
      </p>

      <FeedbackTable />
    </div>
  );
}