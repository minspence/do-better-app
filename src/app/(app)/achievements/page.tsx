"use client";

import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

// Stub page — wire up to useAchievements hook once the achievements
// table is populated in Supabase.
export default function AchievementsPage() {
  return (
    <div className="px-4">
      <Header
        title="Achievements"
        subtitle="Unlock badges by hitting milestones"
      />

      {/* Summary row */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "Earned", value: "0" },
          { label: "Total", value: "—" },
          { label: "XP Bonus", value: "0" },
        ].map(({ label, value }) => (
          <Card key={label} className="text-center py-3">
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* Placeholder achievement grid */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Streak Milestones
      </h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {PLACEHOLDER_ACHIEVEMENTS.filter((a) => a.category === "streak").map(
          (a) => (
            <AchievementTile key={a.id} achievement={a} />
          ),
        )}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Completions
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {PLACEHOLDER_ACHIEVEMENTS.filter(
          (a) => a.category === "completions",
        ).map((a) => (
          <AchievementTile key={a.id} achievement={a} />
        ))}
      </div>
    </div>
  );
}

interface PlaceholderAchievement {
  id: string;
  icon: string;
  label: string;
  description: string;
  category: "streak" | "completions";
  earned: boolean;
}

function AchievementTile({
  achievement,
}: {
  achievement: PlaceholderAchievement;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col items-center gap-1 py-4 text-center",
        !achievement.earned && "opacity-40",
      )}
    >
      <span className={cn("text-3xl", !achievement.earned && "grayscale")}>
        {achievement.icon}
      </span>
      <p className="text-xs font-medium text-white leading-tight">
        {achievement.label}
      </p>
    </Card>
  );
}

const PLACEHOLDER_ACHIEVEMENTS: PlaceholderAchievement[] = [
  {
    id: "s3",
    icon: "🔥",
    label: "3-Day Streak",
    description: "Keep it up for 3 days",
    category: "streak",
    earned: false,
  },
  {
    id: "s7",
    icon: "⚡",
    label: "Week Warrior",
    description: "7-day streak",
    category: "streak",
    earned: false,
  },
  {
    id: "s30",
    icon: "💪",
    label: "Monthly Grind",
    description: "30-day streak",
    category: "streak",
    earned: false,
  },
  {
    id: "s90",
    icon: "🏆",
    label: "Quarter Strong",
    description: "90-day streak",
    category: "streak",
    earned: false,
  },
  {
    id: "s365",
    icon: "💎",
    label: "Year of Gains",
    description: "365-day streak",
    category: "streak",
    earned: false,
  },
  {
    id: "s7x2",
    icon: "🌟",
    label: "Legend",
    description: "365+ day streak",
    category: "streak",
    earned: false,
  },
  {
    id: "c10",
    icon: "✅",
    label: "First 10",
    description: "Complete 10 habits",
    category: "completions",
    earned: false,
  },
  {
    id: "c50",
    icon: "🎯",
    label: "50 Done",
    description: "Complete 50 habits",
    category: "completions",
    earned: false,
  },
  {
    id: "c100",
    icon: "💯",
    label: "Century",
    description: "Complete 100 habits",
    category: "completions",
    earned: false,
  },
];
