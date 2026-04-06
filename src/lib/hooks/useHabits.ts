"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";
import { isToday } from "date-fns";
import type { Habit, HabitLog, HabitWithCompletion } from "@/types/app.types";
import type { HabitCategory } from "@/types/database.types";

// Fetches all habits for the current user and enriches them with
// today's completion status. Optionally filter by category.
//
// Usage:
//   const { habits, loading, completeHabit } = useHabits();
//   const { habits } = useHabits({ category: "exercise" });
export function useHabits(options?: { category?: HabitCategory }) {
  const { user } = useAuth();
  const supabase = createClient();

  const [habits, setHabits] = useState<HabitWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    // Fetch habits
    let query = supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (options?.category) {
      query = query.eq("category", options.category);
    }

    const { data: habitsData, error: habitsError } = await query;

    if (habitsError) {
      setError(habitsError.message);
      setLoading(false);
      return;
    }

    // Fetch today's logs for all habits
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data: logsData } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("completed_at", startOfDay)
      .lte("completed_at", endOfDay);

    const logs: HabitLog[] = logsData ?? [];

    // Merge completion status into habits
    const enriched: HabitWithCompletion[] = (habitsData ?? []).map(
      (habit: Habit) => {
        const todayLogs = logs.filter((log) => log.habit_id === habit.id);
        return {
          ...habit,
          completedToday: todayLogs.length >= habit.target_count,
          todayCount: todayLogs.length,
        };
      },
    );

    setHabits(enriched);
    setLoading(false);
  }, [user, options?.category]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Mark a habit as completed. Inserts a log entry and triggers XP + streak
  // recalculation on the profile.
  const completeHabit = async (habitId: string) => {
    if (!user) return { error: "Not authenticated" };

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return { error: "Habit not found" };
    if (habit.completedToday) return { error: "Already completed today" };

    const { error } = await supabase.from("habit_logs").insert({
      habit_id: habitId,
      user_id: user.id,
    });

    if (!error) {
      // Optimistically update local state
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId
            ? {
                ...h,
                todayCount: h.todayCount + 1,
                completedToday: h.todayCount + 1 >= h.target_count,
              }
            : h,
        ),
      );

      // Award XP to profile — this would ideally be a Supabase Edge Function
      // to prevent client-side manipulation. Stub for now.
      await supabase.rpc("award_xp", {
        user_id: user.id,
        amount: habit.xp_reward,
      });

      await supabase.rpc("update_streak", {
        user_id: user.id,
      });
    }

    return { error };
  };

  const createHabit = async (
    habit: Pick<
      Habit,
      "title" | "category" | "frequency" | "target_count" | "xp_reward"
    >,
  ) => {
    if (!user) return { error: "Not authenticated" };

    const { data, error } = await supabase
      .from("habits")
      .insert({ ...habit, user_id: user.id })
      .select()
      .single();

    if (!error) await fetchHabits();
    return { data, error };
  };

  const deleteHabit = async (habitId: string) => {
    const { error } = await supabase.from("habits").delete().eq("id", habitId);

    if (!error) {
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
    }

    return { error };
  };

  return {
    habits,
    loading,
    error,
    completeHabit,
    createHabit,
    deleteHabit,
    refetch: fetchHabits,
  };
}
