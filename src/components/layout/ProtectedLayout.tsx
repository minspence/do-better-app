"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

// Wraps all authenticated pages. Redirects to /login if the user has no session.
// Since we're using static export (no middleware), this is the auth guard layer.
//
// Usage: Wrap the (app) group layout with this component.
export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Show nothing while checking auth — avoids a flash of protected content
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  // Don't render protected content if there's no user (redirect is in progress)
  if (!user) return null;

  return <>{children}</>;
}
