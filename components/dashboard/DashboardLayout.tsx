export default function DashboardLayout() {
  return (
    <section className="mx-auto mt-10 max-w-7xl text-white">
      <div className="grid gap-5 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">Total Feedback</p>
          <h3 className="mt-2 text-3xl font-bold">12,847</h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">Positive Sentiment</p>
          <h3 className="mt-2 text-3xl font-bold">74%</h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">AI Themes</p>
          <h3 className="mt-2 text-3xl font-bold">38</h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">Risk Alerts</p>
          <h3 className="mt-2 text-3xl font-bold">7</h3>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-xl font-bold">Feedback Analytics</h2>

        <div className="mt-6 flex h-56 items-end gap-3">
          {[45, 70, 55, 90, 65, 120, 85, 140, 95, 160].map((item, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-700 to-cyan-400"
              style={{ height: `${item}px` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}