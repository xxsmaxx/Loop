import Link from "next/link";
import Logo from "../shared/Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#" className="text-sm text-slate-300 transition hover:text-white">Features</Link>
          <Link href="#" className="text-sm text-slate-300 transition hover:text-white">Analytics</Link>
          <Link href="#" className="text-sm text-slate-300 transition hover:text-white">AI</Link>
          <Link href="#" className="text-sm text-slate-300 transition hover:text-white">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-slate-300 transition hover:text-white">
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}