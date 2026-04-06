"use client";

import {
  getStreakEmoji,
  formatStreakLabel,
  isStreakAtRisk,
} from "@/lib/utils/streaks";
import { cn } from "@/lib/utils/cn";

interface StreakCounterProps {
  streakCount: number;
  lastActiveDateStr: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StreakCounter({
  streakCount,
  lastActiveDateStr,
  className,
  size = "md",
}: StreakCounterProps) {
  const atRisk = isStreakAtRisk(lastActiveDateStr);
  const emoji = getStreakEmoji(streakCount);

  const sizeStyles = {
    sm: {
      container: "gap-1",
      emoji: "text-lg",
      count: "text-xl font-bold",
      label: "text-xs",
    },
    md: {
      container: "gap-2",
      emoji: "text-2xl",
      count: "text-3xl font-bold",
      label: "text-sm",
    },
    lg: {
      container: "gap-3",
      emoji: "text-4xl",
      count: "text-5xl font-bold",
      label: "text-base",
    },
  };

  const styles = sizeStyles[size];

  return (
    <div
      className={cn("flex flex-col items-center", styles.container, className)}
    >
      <span className={styles.emoji}>{emoji}</span>
      <span
        className={cn(styles.count, atRisk ? "text-orange-400" : "text-white")}
      >
        {streakCount}
      </span>
      <span className={cn("text-zinc-400", styles.label)}>
        {atRisk ? "⚠️ Streak at risk!" : formatStreakLabel(streakCount)}
      </span>
    </div>
  );
}
