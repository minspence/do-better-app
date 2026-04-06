"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Primary auth hook — use this anywhere you need the current user.
// Handles session persistence across refreshes and device changes.
//
// Usage:
//   const { user, session, loading } = useAuth();
//   const { user, signOut } = useAuth();
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Get the initial session on mount
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    };

    getSession();

    // Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { data, error };
  };

  return {
    ...state,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
  };
}
