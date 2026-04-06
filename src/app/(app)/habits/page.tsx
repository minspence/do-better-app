"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useHabits } from "@/lib/hooks/useHabits";
import { useProfile } from "@/lib/hooks/useProfile";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { HabitCard } from "@/components/habits/HabitCard";
import { CATEGORIES } from "@/types/app.types";
import type { HabitCategory } from "@/types/database.types";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export default function HabitsPage() {
  const [activeCategory, setActiveCategory] = useState<HabitCategory | "all">(
    "all",
  );
  const { habits, completeHabit, loading } = useHabits(
    activeCategory !== "all" ? { category: activeCategory } : undefined,
  );
  const { profile } = useProfile();

  return (
    <div className="px-4">
      <Header
        title="My Habits"
        right={
          <Link href="/habits/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </Link>
        }
      />

      {/* Category filter tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeCategory === "all"
              ? "bg-indigo-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200",
          )}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat.id
                ? "bg-indigo-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200",
            )}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Habit list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl bg-zinc-800"
            />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-zinc-500">No habits in this category yet.</p>
          <Link href="/habits/new">
            <Button className="mt-4">Add a habit</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={completeHabit}
              isPremiumUser={profile?.is_premium ?? false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
