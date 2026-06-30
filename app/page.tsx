import Hero from "@/components/marketing/Hero";
import Navbar from "@/components/marketing/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
    </main>
  );
}