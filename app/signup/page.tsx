"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Creating account...");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("loopUser", JSON.stringify(data.user));
        setMessage("Signup successful ?");
        router.push("/dashboard");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      setMessage("Signup failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020617] px-6 text-white">
      <div className="w-full max-w-[460px] rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500">
            <Sparkles className="h-7 w-7 text-white" />
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Create your LOOP account
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Start analyzing customer feedback for free.
          </p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <button
            type="submit"
            className="block w-full rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold hover:bg-blue-500"
          >
            Create Account
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-blue-400">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
