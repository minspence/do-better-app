"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useHabits } from "@/lib/hooks/useHabits";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CATEGORIES } from "@/types/app.types";
import type { HabitCategory, HabitFrequency } from "@/types/database.types";
import { cn } from "@/lib/utils/cn";

export default function NewHabitPage() {
  const router = useRouter();
  const { createHabit } = useHabits();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<HabitCategory>("exercise");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [targetCount, setTargetCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a habit name.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await createHabit({
      title: title.trim(),
      category,
      frequency,
      target_count: targetCount,
      xp_reward: calculateXP(frequency, targetCount),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.replace("/habits");
    }
  };

  return (
    <div className="px-4 pt-4">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <h1 className="mb-6 text-xl font-bold text-white">New Habit</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Habit name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Habit Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Morning run, Drink water, Read 10 pages"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-colors",
                  category === cat.id
                    ? "border-indigo-500 bg-indigo-500/10 text-white"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500",
                )}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Frequency
          </label>
          <div className="flex gap-2">
            {FREQUENCIES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFrequency(value)}
                className={cn(
                  "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors",
                  frequency === value
                    ? "border-indigo-500 bg-indigo-500/10 text-white"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Daily target count */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Daily Target
            <span className="ml-2 text-xs text-zinc-500">
              How many times per day?
            </span>
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTargetCount((c) => Math.max(1, c - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-white hover:border-zinc-500 text-lg"
            >
              −
            </button>
            <span className="w-8 text-center text-xl font-bold text-white">
              {targetCount}
            </span>
            <button
              type="button"
              onClick={() => setTargetCount((c) => Math.min(20, c + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-white hover:border-zinc-500 text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* XP preview */}
        <Card className="flex items-center justify-between py-3">
          <span className="text-sm text-zinc-400">XP per completion</span>
          <span className="text-lg font-bold text-indigo-400">
            +{calculateXP(frequency, targetCount)} XP
          </span>
        </Card>

        {error && (
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create Habit
        </Button>
      </form>
    </div>
  );
}

// XP scales with difficulty — weekly habits and higher target counts award more
function calculateXP(frequency: HabitFrequency, targetCount: number): number {
  const base = frequency === "daily" ? 10 : frequency === "weekly" ? 25 : 15;
  return base * targetCount;
}

const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];
