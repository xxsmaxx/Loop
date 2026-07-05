export default function ChartCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur text-white">
      <h2 className="text-lg font-semibold">
        Feedback Analytics
      </h2>

      <div className="mt-6 flex h-56 items-end gap-3">
        {[45, 70, 55, 90, 65, 120, 85, 140, 95, 160].map((item, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-700 to-cyan-400"
            style={{
              height: `${item}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}