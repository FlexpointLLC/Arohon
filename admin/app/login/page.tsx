"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(getAuthErrorMessage(signInError.message));
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(10,191,139,0.2),transparent)]" />
      <div className="relative w-full max-w-[400px]">
        <div className="card p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Arohon Admin
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in with your admin account
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={cn("input-sleek")}
                placeholder="admin@arohon.co"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={cn("input-sleek")}
              />
            </div>
            {error && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            No account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[var(--primary)] hover:opacity-90"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
