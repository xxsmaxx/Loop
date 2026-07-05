import { Bell, Search, Settings } from "lucide-react";

export default function TopBar() {
  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-[#111827] px-6 py-4 shadow-lg">

      <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020617] px-4 py-3 w-[420px]">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          placeholder="Search feedback..."
          className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-4">

        <button className="rounded-xl bg-slate-800 p-3 hover:bg-blue-600 transition">
          <Bell className="h-5 w-5" />
        </button>

        <button className="rounded-xl bg-slate-800 p-3 hover:bg-blue-600 transition">
          <Settings className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 font-bold">
            H
          </div>

          <div>
            <p className="text-sm font-semibold">Harsh Anand</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>

      </div>

    </div>
  );
}