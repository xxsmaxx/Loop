"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { Bell, Palette, Save, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState({
    name: "User",
    email: "",
    role: "User",
  });

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("loopUser");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      setUser({
        name: parsedUser.name || "User",
        email: parsedUser.email || "",
        role: parsedUser.role || "User",
      });
    }
  }, []);

  function setTheme(theme: "dark" | "light") {
    localStorage.setItem("loopTheme", theme);

    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }

    setMessage(`${theme === "dark" ? "Dark" : "Light"} theme applied successfully.`);
  }

  function saveSettings() {
    setMessage("Settings saved successfully.");
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <TopBar />

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-400">LOOP Settings</p>
          <h1 className="mt-2 text-4xl font-bold">Settings</h1>
          <p className="mt-3 text-slate-400">
            Manage your account, notifications, security, and dashboard preferences.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-300">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="mb-6 flex items-center gap-3">
              <User className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Profile Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-400">Name</label>
                <input
                  value={user.name}
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">Email</label>
                <input
                  value={user.email}
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">Role</label>
                <input
                  value={user.role}
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Bell className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className="flex w-full items-center justify-between rounded-xl bg-slate-950 px-4 py-4"
              >
                <span>Email Alerts</span>
                <span className={emailAlerts ? "text-green-400" : "text-red-400"}>
                  {emailAlerts ? "Enabled" : "Disabled"}
                </span>
              </button>

              <button
                onClick={() => setWeeklyReports(!weeklyReports)}
                className="flex w-full items-center justify-between rounded-xl bg-slate-950 px-4 py-4"
              >
                <span>Weekly Reports</span>
                <span className={weeklyReports ? "text-green-400" : "text-red-400"}>
                  {weeklyReports ? "Enabled" : "Disabled"}
                </span>
              </button>

              <button
                onClick={() => setRiskAlerts(!riskAlerts)}
                className="flex w-full items-center justify-between rounded-xl bg-slate-950 px-4 py-4"
              >
                <span>Risk Alerts</span>
                <span className={riskAlerts ? "text-yellow-400" : "text-red-400"}>
                  {riskAlerts ? "Important" : "Disabled"}
                </span>
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-950 px-4 py-4">
                <p className="font-semibold">Two Factor Authentication</p>
                <p className="mt-1 text-sm text-slate-400">
                  Coming soon: add extra protection to your account.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 px-4 py-4">
                <p className="font-semibold">Change Password</p>
                <p className="mt-1 text-sm text-slate-400">
                  Coming soon: update your login password securely.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Palette className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold">Appearance</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setTheme("dark")}
                className="rounded-xl border border-blue-500 bg-slate-950 px-5 py-4 text-white hover:bg-blue-600"
              >
                Dark Mode
              </button>

              <button
                onClick={() => setTheme("light")}
                className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 text-white hover:bg-blue-600"
              >
                Light Mode
              </button>
            </div>
          </section>
        </div>

        <button
          onClick={saveSettings}
          className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-500"
        >
          <Save className="h-5 w-5" />
          Save Settings
        </button>
      </main>
    </div>
  );
}
