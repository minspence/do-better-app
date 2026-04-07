"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfile } from "@/lib/hooks/useProfile";

interface AppShellProps {
  children: React.ReactNode;
}

// Auth + onboarding guard for all (app) pages.
// Redirects to /login if unauthenticated, /onboarding if onboarding is incomplete.
// The (onboarding) route group uses the plain ProtectedLayout instead.
export function AppShell({ children }: AppShellProps) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (profile && !profile.onboarding_completed) {
      router.replace("/onboarding");
    }
  }, [user, authLoading, profile, profileLoading, router]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!user || !profile?.onboarding_completed) return null;

  return <>{children}</>;
}
