"use client";

import { Settings, Crown, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfile } from "@/lib/hooks/useProfile";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakCounter } from "@/components/gamification/StreakCounter";

export default function ProfilePage() {
  const { signOut } = useAuth();
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-4">
      <Header title="Profile" />

      {/* Avatar + name */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white">
          {profile?.display_name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {profile?.display_name}
          </p>
          <p className="text-sm text-zinc-500">
            @{profile?.username ?? "set a username"}
          </p>
        </div>
        {profile?.is_premium && (
          <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400">
            <Crown className="h-3 w-3" /> Premium
          </span>
        )}
      </div>

      {/* XP bar */}
      {profile && (
        <Card className="mb-4">
          <XPBar totalXP={profile.xp} />
        </Card>
      )}

      {/* Stats row */}
      {profile && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Card className="text-center py-3">
            <StreakCounter
              streakCount={profile.streak_count}
              lastActiveDateStr={profile.last_active_date}
              size="sm"
            />
          </Card>
          <Card className="text-center py-3">
            <p className="text-xl font-bold text-white">
              {profile.longest_streak}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">Best Streak</p>
          </Card>
          <Card className="text-center py-3">
            <p className="text-xl font-bold text-white">{profile.level}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Level</p>
          </Card>
        </div>
      )}

      {/* Premium upgrade prompt */}
      {!profile?.is_premium && (
        <Link href="/premium">
          <Card glow className="mb-4 flex items-center gap-3">
            <Crown className="h-6 w-6 text-yellow-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">
                Upgrade to Premium
              </p>
              <p className="text-xs text-zinc-400">
                Unlock workout plans, diet templates & more
              </p>
            </div>
          </Card>
        </Link>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <Link href="/settings">
          <Button variant="secondary" fullWidth>
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
        <Button variant="ghost" fullWidth onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
