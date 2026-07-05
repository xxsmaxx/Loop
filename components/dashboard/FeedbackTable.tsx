export default function FeedbackTable() {
  const feedbacks = [
    {
      user: "Amazon",
      topic: "Payment Failed",
      sentiment: "Negative",
      status: "Open",
    },
    {
      user: "Flipkart",
      topic: "Fast Delivery",
      sentiment: "Positive",
      status: "Closed",
    },
    {
      user: "Swiggy",
      topic: "Late Delivery",
      sentiment: "Negative",
      status: "Open",
    },
    {
      user: "Zomato",
      topic: "Easy Checkout",
      sentiment: "Positive",
      status: "Closed",
    },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
      <h2 className="mb-5 text-xl font-bold text-white">
        Recent Feedback
      </h2>

      <table className="w-full text-left">
        <thead className="border-b border-slate-700 text-slate-400">
          <tr>
            <th className="pb-3">Company</th>
            <th className="pb-3">Topic</th>
            <th className="pb-3">Sentiment</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {feedbacks.map((item, index) => (
            <tr
              key={index}
              className="border-b border-slate-800 hover:bg-slate-800/40"
            >
              <td className="py-4 text-white">{item.user}</td>

              <td className="py-4 text-slate-300">
                {item.topic}
              </td>

              <td
                className={`py-4 font-semibold ${
                  item.sentiment === "Positive"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {item.sentiment}
              </td>

              <td className="py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    item.status === "Closed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}