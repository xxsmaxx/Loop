const feedbacks = [
  { company: "Amazon", feedback: "Payment failed during checkout", sentiment: "Negative", status: "Open", date: "Today" },
  { company: "Flipkart", feedback: "Delivery experience was smooth", sentiment: "Positive", status: "Closed", date: "Yesterday" },
  { company: "Swiggy", feedback: "App was slow while ordering", sentiment: "Negative", status: "Open", date: "2 days ago" },
  { company: "Zomato", feedback: "Loved the new dashboard UI", sentiment: "Positive", status: "Closed", date: "3 days ago" },
];

export default function FeedbackTable() {
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">All Feedback</h2>

        <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500">
          Add Feedback
        </button>
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search feedback..."
          className="w-96 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
        />

        <select className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none">
          <option>All Sentiments</option>
          <option>Positive</option>
          <option>Negative</option>
        </select>
      </div>

      <table className="w-full text-left">
        <thead className="border-b border-slate-700 text-sm text-slate-400">
          <tr>
            <th className="pb-3">Company</th>
            <th className="pb-3">Feedback</th>
            <th className="pb-3">Sentiment</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Date</th>
            <th className="pb-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {feedbacks.map((item) => (
            <tr key={item.company} className="border-b border-slate-800 hover:bg-slate-800/40">
              <td className="py-4 text-white">{item.company}</td>
              <td className="py-4 text-slate-300">{item.feedback}</td>

              <td className={item.sentiment === "Positive" ? "py-4 font-semibold text-emerald-400" : "py-4 font-semibold text-red-400"}>
                {item.sentiment}
              </td>

              <td className="py-4">
                <span className={item.status === "Closed" ? "rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400" : "rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400"}>
                  {item.status}
                </span>
              </td>

              <td className="py-4 text-slate-400">{item.date}</td>

              <td className="py-4">
                <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-blue-600 hover:text-white">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}