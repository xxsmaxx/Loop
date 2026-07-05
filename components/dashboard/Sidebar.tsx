"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Bot,
  FileText,
  Settings,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Feedback", icon: MessageSquare, href: "/feedback" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  {name: "AI Assistant", icon: Bot, href: "/ai-assistant" },
  {name: "Reports", icon: FileText, href: "/reports" },
  { name: "Settings", icon: Settings, href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-72 border-r border-white/10 bg-slate-950/95 p-5 text-white">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h1 className="text-3xl font-bold">LOOP</h1>
        <p className="text-sm text-slate-400">AI Feedback Intelligence</p>
      </div>

      <nav className="mt-6 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}