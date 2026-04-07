"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const { signUpWithEmail } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await signUpWithEmail(email, password, displayName);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Supabase sends a confirmation email by default.
      // You can disable this in Supabase Dashboard → Auth → Settings → Confirm email.
      router.replace("/onboarding");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mb-3 text-5xl">🚀</div>
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Start your 14-day free trial — no credit card needed
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How should we call you?"
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-zinc-600">
        By signing up you agree to our Terms of Service and Privacy Policy.
      </p>

      <p className="mt-4 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
