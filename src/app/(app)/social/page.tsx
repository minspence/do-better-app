"use client";

import { useState } from "react";
import { Users, Trophy, Swords } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

type SocialTab = "leaderboard" | "friends" | "challenges";

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<SocialTab>("leaderboard");

  return (
    <div className="px-4">
      <Header title="Social" subtitle="Compete and grow together" />

      {/* Tab bar */}
      <div className="mb-5 flex gap-1 rounded-2xl bg-zinc-900 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium transition-colors",
              activeTab === id
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "leaderboard" && <LeaderboardTab />}
      {activeTab === "friends" && <FriendsTab />}
      {activeTab === "challenges" && <ChallengesTab />}
    </div>
  );
}

// ─── Tab content stubs ───────────────────────────────────────────────────────

function LeaderboardTab() {
  return (
    <div>
      <p className="mb-4 text-xs text-zinc-500">
        Weekly XP ranking among your friends
      </p>
      <Card className="py-12 text-center text-zinc-500 text-sm">
        Add friends to see the leaderboard
      </Card>
    </div>
  );
}

function FriendsTab() {
  return (
    <div>
      <Card className="py-12 text-center">
        <p className="text-zinc-500 text-sm">Find friends by username</p>
        <div className="mt-4 flex gap-2">
          <input
            placeholder="Search username..."
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-indigo-500"
          />
          <button className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white">
            Search
          </button>
        </div>
      </Card>
    </div>
  );
}

function ChallengesTab() {
  return (
    <div>
      <Card className="py-12 text-center text-zinc-500 text-sm">
        No active challenges — create one or browse public challenges
      </Card>
    </div>
  );
}

const TABS: { id: SocialTab; label: string; icon: React.ElementType }[] = [
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "friends", label: "Friends", icon: Users },
  { id: "challenges", label: "Challenges", icon: Swords },
];
