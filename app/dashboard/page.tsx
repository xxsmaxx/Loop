import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm text-blue-400">LOOP Dashboard</p>

        <h1 className="mt-2 text-4xl font-bold">
          Customer Intelligence Overview
        </h1>

        <p className="mt-3 text-slate-400">
          Track feedback, sentiment, AI insights, and customer activity in one place.
        </p>

        <DashboardLayout />
      </div>
    </main>
  );
}