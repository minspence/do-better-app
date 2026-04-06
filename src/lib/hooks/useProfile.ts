"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";
import type { Profile } from "@/types/app.types";

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

// Fetches and manages the current user's profile.
// Profile is created automatically in Supabase via a database trigger
// when a user signs up — see the SQL setup guide.
//
// Usage:
//   const { profile, loading, updateProfile } = useProfile();
export function useProfile() {
  const { user } = useAuth();
  const supabase = createClient();

  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: true,
    error: null,
  });

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setState({ profile: null, loading: false, error: null });
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      setState({ profile: null, loading: false, error: error.message });
    } else {
      setState({ profile: data, loading: false, error: null });
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: "Not authenticated" };

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (!error && data) {
      setState((prev) => ({ ...prev, profile: data }));
    }

    return { data, error };
  };

  return {
    ...state,
    updateProfile,
    refetch: fetchProfile,
  };
}
