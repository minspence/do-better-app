"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useProfile } from "@/lib/hooks/useProfile";
import { useHabits } from "@/lib/hooks/useHabits";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { XPBar } from "@/components/gamification/XPBar";
import { HabitCard } from "@/components/habits/HabitCard";
import { CATEGORIES } from "@/types/app.types";

export default function DashboardPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { habits, completeHabit, loading: habitsLoading } = useHabits();

  const todayComplete = habits.filter((h) => h.completedToday).length;
  const todayTotal = habits.length;
  const greeting = getGreeting();

  return (
    <div className="px-4 pt-2">
      {/* Header */}
      <Header
        title={`${greeting}, ${profile?.display_name ?? "there"} 👋`}
        subtitle={
          todayTotal > 0
            ? `${todayComplete} of ${todayTotal} habits done today`
            : "Add your first habit to get started"
        }
        right={
          <Link href="/habits/new">
            <Button size="sm" variant="secondary">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </Link>
        }
      />

      {/* Streak + XP row */}
      {profile && (
        <Card className="mb-4 flex items-center gap-6">
          <StreakCounter
            streakCount={profile.streak_count}
            lastActiveDateStr={profile.last_active_date}
            size="md"
          />
          <div className="flex-1">
            <XPBar totalXP={profile.xp} />
          </div>
        </Card>
      )}

      {/* Today's habits */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Today
        </h2>
        {habitsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-zinc-800"
              />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-zinc-400 text-sm">No habits yet.</p>
            <Link href="/habits/new">
              <Button size="sm" className="mt-3">
                Add your first habit
              </Button>
            </Link>
          </Card>
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
      </section>

      {/* Category quick-links */}
      <section className="mb-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Browse Categories
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={cat.href}>
              <Card className="flex items-center gap-3 active:scale-95 transition-transform">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{cat.label}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
