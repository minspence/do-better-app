// App-level convenience types derived from the generated database schema.
// Import raw DB types from database.types.ts; import these in hooks and components.

import type { Database, HabitCategory } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];

export type HabitWithCompletion = Habit & {
  completedToday: boolean;
  todayCount: number;
};

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  title: string;
}

export const CATEGORIES: {
  id: HabitCategory;
  label: string;
  icon: string;
  href: string;
}[] = [
  { id: "self-improvement", label: "Self Improvement", icon: "🧠", href: "/categories/self-improvement" },
  { id: "exercise", label: "Exercise", icon: "💪", href: "/categories/exercise" },
  { id: "memorization", label: "Memorization", icon: "📚", href: "/categories/memorization" },
  { id: "diet", label: "Diet", icon: "🥗", href: "/categories/diet" },
];
