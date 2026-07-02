"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  MessageSquare,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  BarChart3,
} from "lucide-react";


const stats = [
  { label: "Feedback analyzed", value: "12.8k" },
  { label: "AI themes found", value: "38" },
  { label: "Positive sentiment", value: "74%" },
];

const bars = [55, 80, 64, 100, 75, 120, 92, 135, 108, 150, 126, 170];

export default function Hero() {
  return (
   <section className="relative overflow-hidden bg-[#020617] px-6 pb-24 pt-40 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb33,transparent_35%),radial-gradient(circle_at_80%_20%,#06b6d433,transparent_30%)]" />

      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-20 top-32 h-24 w-24 rounded-3xl border border-blue-400/20 bg-blue-500/10 blur-sm"
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Sparkles className="h-4 w-4" />
            AI Customer Feedback Intelligence Platform
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Turn messy feedback into{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              clear product decisions
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            LOOP helps product teams collect feedback, classify sentiment,
            detect themes, generate reports, and ask AI questions backed by real
            customer data.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex items-center rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:scale-105 hover:bg-blue-500"
            >
              Start Free
              <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-700 bg-white/5 px-7 py-4 font-semibold text-slate-200 backdrop-blur transition hover:border-blue-400/50 hover:bg-white/10"
            >
              View Live Demo
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur"
              >
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mx-auto mt-16 max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-blue-950/50 backdrop-blur-xl"
        >
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">LOOP Dashboard</p>
                <h2 className="text-2xl font-bold">
                  Customer Intelligence Overview
                </h2>
              </div>

              <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                Live AI Insights
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
             {[
  { label: "Total Feedback", value: "12,847", sub: "+18%", Icon: MessageSquare },
  { label: "Sentiment", value: "74%", sub: "Positive", Icon: TrendingUp },
  { label: "AI Themes", value: "38", sub: "Auto clustered", Icon: Bot },
  { label: "Risk Alerts", value: "7", sub: "Need action", Icon: ShieldCheck },
].map(({ label, value, sub, Icon }) => (
                <div
                  key={String(label)}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:-translate-y-1 hover:border-blue-500/50"
                >
                  <Icon className="h-6 w-6 text-blue-400" />
                  <p className="mt-4 text-sm text-slate-400">{label}</p>
                  <h3 className="mt-2 text-3xl font-bold">{value}</h3>
                  <p className="mt-2 text-sm text-emerald-400">{sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">Feedback Volume</p>
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>

                <div className="mt-8 flex h-60 items-end gap-3">
                  {bars.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: h }}
                      transition={{ duration: 0.8, delay: i * 0.04 }}
                      className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-300"
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-400" />
                  <p className="text-sm text-slate-400">Ask LOOP AI</p>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
                  What are users saying about onboarding?
                </div>

                <div className="mt-4 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 text-sm text-slate-200">
                  Users love the new dashboard, but onboarding steps and payment
                  reliability need improvement this week.
                </div>

                <div className="mt-5 space-y-3">
                  {["Payment issues up 23%", "Dashboard praise increased", "Onboarding needs attention"].map(
                    (item) => (
                      <div
                        key={item}
                        className="rounded-xl bg-slate-950 p-3 text-sm text-slate-300"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}