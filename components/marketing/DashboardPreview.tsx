"use client";

import { motion } from "framer-motion";
import { Bot, MessageSquare, TrendingUp } from "lucide-react";

export default function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="mx-auto mt-16 max-w-6xl rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-blue-950/50 backdrop-blur-xl"
    >
      <div className="rounded-[24px] border border-slate-800 bg-slate-950 p-6 text-white">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">LOOP Dashboard</p>
            <h2 className="text-2xl font-bold">Customer Intelligence Overview</h2>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            Live AI Insights
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <MessageSquare className="h-6 w-6 text-blue-400" />
            <p className="mt-4 text-sm text-slate-400">Total Feedback</p>
            <h3 className="mt-2 text-3xl font-bold">12,847</h3>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <TrendingUp className="h-6 w-6 text-cyan-400" />
            <p className="mt-4 text-sm text-slate-400">Positive Sentiment</p>
            <h3 className="mt-2 text-3xl font-bold">74%</h3>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <Bot className="h-6 w-6 text-purple-400" />
            <p className="mt-4 text-sm text-slate-400">AI Themes</p>
            <h3 className="mt-2 text-3xl font-bold">38</h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
}