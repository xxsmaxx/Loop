import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import FeedbackPage from "@/components/feedback/FeedbackPage";

export default function Page() {
  return (
    <main className="flex min-h-screen bg-[#020817]">
      <Sidebar />

      <section className="flex-1 px-8 py-8">
        <TopBar />
        <FeedbackPage />
      </section>
    </main>
  );
}