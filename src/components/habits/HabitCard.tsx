"use client";

import { CheckCircle2, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CATEGORIES } from "@/types/app.types";
import type { HabitWithCompletion } from "@/types/app.types";

interface HabitCardProps {
  habit: HabitWithCompletion;
  onComplete: (id: string) => void;
  isPremiumUser: boolean;
}

export function HabitCard({
  habit,
  onComplete,
  isPremiumUser,
}: HabitCardProps) {
  const category = CATEGORIES.find((c) => c.id === habit.category);
  const isLocked = habit.is_premium_content && !isPremiumUser;

  const handleTap = () => {
    if (isLocked || habit.completedToday) return;
    onComplete(habit.id);
  };

  return (
    <button
      onClick={handleTap}
      disabled={habit.completedToday || isLocked}
      className={cn(
        "w-full rounded-2xl p-4 text-left transition-all active:scale-[0.98]",
        "border border-zinc-800 bg-zinc-900",
        habit.completedToday && "opacity-60",
        isLocked && "cursor-not-allowed opacity-50",
        !habit.completedToday &&
          !isLocked &&
          "hover:border-zinc-600 hover:bg-zinc-800",
      )}
    >
      <div className="flex items-center gap-3">
        {/* Completion indicator */}
        <div className="shrink-0">
          {isLocked ? (
            <Lock className="h-6 w-6 text-zinc-600" />
          ) : habit.completedToday ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <Circle className="h-6 w-6 text-zinc-600" />
          )}
        </div>

        {/* Habit info */}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium",
              habit.completedToday
                ? "text-zinc-500 line-through"
                : "text-white",
            )}
          >
            {habit.title}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-zinc-500">
              {category?.icon} {category?.label}
            </span>
            {habit.target_count > 1 && (
              <span className="text-xs text-zinc-600">
                {habit.todayCount}/{habit.target_count}
              </span>
            )}
          </div>
        </div>

        {/* XP reward */}
        {!isLocked && !habit.completedToday && (
          <span className="shrink-0 rounded-full bg-indigo-600/20 px-2 py-0.5 text-xs font-medium text-indigo-400">
            +{habit.xp_reward} XP
          </span>
        )}

        {isLocked && (
          <span className="shrink-0 rounded-full bg-yellow-600/20 px-2 py-0.5 text-xs font-medium text-yellow-500">
            Premium
          </span>
        )}
      </div>

      {/* Progress bar for multi-count habits */}
      {habit.target_count > 1 && !habit.completedToday && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{
              width: `${(habit.todayCount / habit.target_count) * 100}%`,
            }}
          />
        </div>
      )}
    </button>
  );
}
