import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-400 shadow-lg shadow-blue-500/25">
        <Sparkles className="h-6 w-6 text-white" />
      </div>

      <div className="hidden sm:block">
        <p className="text-xl font-bold tracking-tight text-white">LOOP</p>
        <p className="text-xs text-slate-400">AI Feedback Intelligence</p>
      </div>
    </Link>
  );
}