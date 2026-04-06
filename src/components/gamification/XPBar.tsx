"use client";

import { getLevelInfo } from "@/lib/utils/xp";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils/cn";

interface XPBarProps {
  totalXP: number;
  className?: string;
  showTitle?: boolean;
}

export function XPBar({ totalXP, className, showTitle = true }: XPBarProps) {
  const info = getLevelInfo(totalXP);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {info.level}
          </span>
          {showTitle && (
            <span className="text-sm font-medium text-zinc-300">
              {info.title}
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-500">
          {info.currentXP - info.xpForCurrentLevel} /{" "}
          {info.xpForNextLevel - info.xpForCurrentLevel} XP
        </span>
      </div>
      <ProgressBar value={info.progressPercent} size="md" color="indigo" />
    </div>
  );
}
