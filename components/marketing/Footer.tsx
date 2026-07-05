import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-8 pb-16 pt-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-10 text-center">
          <h2 className="text-4xl font-bold">
            Ready to turn feedback into growth?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Start using LOOP to collect feedback, analyze sentiment, and make smarter product decisions.
          </p>

          <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold hover:bg-blue-500">
            Start Free
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <div>
            <h3 className="text-2xl font-bold">LOOP</h3>
            <p className="text-sm text-slate-400">
              AI Feedback Intelligence Platform
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 LOOP. Built by Harsh Anand.
          </p>
        </div>
      </div>
    </footer>
  );
}