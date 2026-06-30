export default function Hero() {
  return (
    <section className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-6 text-sm font-medium text-blue-400">
          AI-powered feedback intelligence
        </p>

        <h1 className="mx-auto max-w-5xl text-5xl font-bold tracking-tight md:text-7xl">
          Turn customer feedback into{" "}
          <span className="text-blue-400">product decisions</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          LOOP helps teams collect, classify, analyze, and summarize customer
          feedback using AI-powered insights.
        </p>

        <div className="mt-10">
          <a
            href="/signup"
            className="rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white hover:bg-blue-700"
          >
            Start Building
          </a>
        </div>
      </div>
    </section>
  );
}