"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHabits } from "@/lib/hooks/useHabits";
import { useProfile } from "@/lib/hooks/useProfile";
import { HabitCard } from "@/components/habits/HabitCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const TIPS = [
  "Start with 2-minute versions of hard habits — lower the barrier until it's automatic.",
  "Journal for 5 minutes daily. Writing clarifies thinking and accelerates growth.",
  "Identity precedes behavior: decide who you want to be, then act like that person.",
];

const PREMIUM_CONTENT = [
  { title: "Productivity System Templates", description: "Time-blocking, GTD, and deep work frameworks" },
  { title: "Mindset Mastery Course", description: "12 lessons on building mental resilience" },
  { title: "Morning Routine Blueprint", description: "Design a morning that sets the tone for the day" },
];

export default function SelfImprovementCategoryPage() {
  const router = useRouter();
  const { habits, completeHabit, loading } = useHabits({ category: "self-improvement" });
  const { profile } = useProfile();

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🧠</span>
          <div>
            <h1 className="text-2xl font-bold text-white">Self-Improvement</h1>
            <p className="text-sm text-zinc-400">Build the habits that compound into the person you want to be</p>
          </div>
        </div>
      </div>

      {/* My Habits */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            My Habits
          </h2>
          <Link href="/habits/new">
            <Button size="sm" variant="secondary">
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-zinc-800" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-zinc-400 text-sm mb-3">No self-improvement habits yet.</p>
            <Link href="/habits/new">
              <Button size="sm">Add your first one</Button>
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

      {/* Tips */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Quick Tips
        </h2>
        <div className="space-y-2">
          {TIPS.map((tip) => (
            <Card key={tip} className="py-3 flex items-start gap-3">
              <span className="text-lg shrink-0">🧠</span>
              <p className="text-sm text-zinc-300">{tip}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Premium content */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Premium Content
          </h2>
          {!profile?.is_premium && (
            <Link href="/premium">
              <span className="text-xs text-indigo-400 font-medium">Unlock →</span>
            </Link>
          )}
        </div>
        <div className="space-y-2">
          {PREMIUM_CONTENT.map((item) => (
            <Card key={item.title} className={!profile?.is_premium ? "opacity-60" : ""}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>
                </div>
                {!profile?.is_premium && <Lock className="h-4 w-4 text-zinc-600 shrink-0" />}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
