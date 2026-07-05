import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import TopBar from "../../components/dashboard/TopBar";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <section className="flex-1 px-8 py-8">
        <TopBar />

        <p className="text-sm text-blue-400">LOOP Dashboard</p>

        <h1 className="mt-2 text-4xl font-bold">
          Customer Intelligence Overview
        </h1>

        <p className="mt-3 text-slate-400">
          Track feedback, sentiment, AI insights, and customer activity in one place.
        </p>

        <DashboardLayout />
      </section>
    </main>
  );
}