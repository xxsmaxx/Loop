"use client";

import { Bell, LogOut, Search } from "lucide-react";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import ThemeToggle from "../shared/ThemeToggle";

export default function TopBar() {
  const [user, setUser] = useState({
    name: "User",
    role: "VIEWER",
  });

  useEffect(() => {
    async function loadSession() {
      const session = await getSession();

      if (session?.user) {
        setUser({
          name: session.user.name || "User",
          role: (session.user as any).role || "VIEWER",
        });
      }
    }

    loadSession();
  }, []);

  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-[#111827] px-6 py-4 shadow-lg">
      <div className="flex w-[420px] items-center gap-3 rounded-xl border border-slate-700 bg-[#020617] px-4 py-3">
        <Search className="h-5 w-5 text-slate-400" />

        <input
          placeholder="Search feedback..."
          className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-xl bg-slate-800 p-3 hover:bg-blue-600">
          <Bell className="h-5 w-5" />
        </button>

        <ThemeToggle />

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-xl bg-red-500/20 p-3 text-red-400 hover:bg-red-600 hover:text-white"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
