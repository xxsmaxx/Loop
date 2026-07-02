import type { ComponentType } from "react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: ComponentType<{ className?: string }>;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white backdrop-blur transition hover:-translate-y-1 hover:border-blue-500/50">
      <Icon className="h-6 w-6 text-blue-400" />
      <p className="mt-4 text-sm text-slate-400">{title}</p>
      <h3 className="mt-2 text-3xl font-bold">{value}</h3>
      <p className="mt-2 text-sm text-emerald-400">{change}</p>
    </div>
  );
}