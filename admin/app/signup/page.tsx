"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INVITE_CODE_REQUIRED = !!process.env.NEXT_PUBLIC_ADMIN_INVITE_CODE;

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (INVITE_CODE_REQUIRED && !inviteCode.trim()) {
      setError("Invite code is required");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() || undefined },
      },
    });

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError.message));
      setLoading(false);
      return;
    }

    if (!signUpData.user) {
      setError("Sign up failed. Please try again.");
      setLoading(false);
      return;
    }

    const accessToken = signUpData.session?.access_token;
    if (!accessToken) {
      setError("Session not ready. Please sign in from the login page.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/admin/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken,
        inviteCode: inviteCode.trim() || undefined,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Could not complete admin setup.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const inputClass = cn("input-sleek");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(10,191,139,0.2),transparent)]" />
      <div className="relative w-full max-w-[420px]">
        <div className="card p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Create admin account
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign up to access the Arohon admin panel
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-300">
                Full name (optional)
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className={inputClass}
                placeholder="Admin User"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
                placeholder="admin@arohon.co"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className={inputClass}
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-300">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className={inputClass}
              />
            </div>
            {INVITE_CODE_REQUIRED && (
              <div>
                <label htmlFor="inviteCode" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Invite code
                </label>
                <input
                  id="inviteCode"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Enter invite code"
                />
              </div>
            )}
            {error && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account…" : "Sign up"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[var(--primary)] hover:opacity-90">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
