import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { Bell, Shield, User, Palette, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <section className="flex-1 px-8 py-8">
        <TopBar />

        <div className="mt-8">
          <p className="text-sm text-blue-400">LOOP Settings</p>

          <h1 className="mt-2 text-4xl font-bold">Settings</h1>

          <p className="mt-3 text-slate-400">
            Manage your account, notifications, security, and dashboard preferences.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-bold">Profile Settings</h2>
            </div>

            <div className="mt-6 space-y-4">
              <input
                defaultValue="Harsh Anand"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none"
              />

              <input
                defaultValue="harsh@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none"
              />

              <input
                defaultValue="Admin"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-yellow-400" />
              <h2 className="text-xl font-bold">Notifications</h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
                <p className="text-sm">Email Alerts</p>
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                  Enabled
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
                <p className="text-sm">Weekly Reports</p>
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                  Enabled
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
                <p className="text-sm">Risk Alerts</p>
                <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
                  Important
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-bold">Security</h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm font-semibold">Two Factor Authentication</p>
                <p className="mt-1 text-xs text-slate-400">
                  Add extra protection to your account.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm font-semibold">Change Password</p>
                <p className="mt-1 text-xs text-slate-400">
                  Update your login password securely.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="flex items-center gap-3">
              <Palette className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-bold">Appearance</h2>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-blue-500 bg-slate-950 p-4 text-center text-sm">
                Dark
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-center text-sm text-slate-400">
                Blue
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-center text-sm text-slate-400">
                Compact
              </div>
            </div>
          </div>
        </div>

        <button className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold hover:bg-blue-500">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </section>
    </main>
  );
}