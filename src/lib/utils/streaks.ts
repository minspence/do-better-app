import {
  isToday,
  isYesterday,
  differenceInCalendarDays,
  parseISO,
} from "date-fns";

// ─── Streak Utilities ────────────────────────────────────────────────────────
//
// Streaks are calculated based on consecutive days of activity.
// A streak is maintained if the user completes at least one habit:
//   - today, OR
//   - yesterday (and hasn't checked in yet today)
//
// A streak is broken if the last_active_date is 2+ days ago.

/**
 * Returns whether the user's streak is currently active (not broken).
 * @param lastActiveDateStr ISO date string from profiles.last_active_date
 */
export function isStreakActive(lastActiveDateStr: string | null): boolean {
  if (!lastActiveDateStr) return false;

  const lastActive = parseISO(lastActiveDateStr);
  return isToday(lastActive) || isYesterday(lastActive);
}

/**
 * Returns whether the streak is "at risk" today —
 * the user was active yesterday but hasn't checked in yet today.
 * Use this to trigger the streak-at-risk notification.
 */
export function isStreakAtRisk(lastActiveDateStr: string | null): boolean {
  if (!lastActiveDateStr) return false;
  const lastActive = parseISO(lastActiveDateStr);
  return isYesterday(lastActive);
}

/**
 * Returns the number of days since the user was last active.
 * Returns 0 if they were active today.
 */
export function daysSinceLastActive(lastActiveDateStr: string | null): number {
  if (!lastActiveDateStr) return Infinity;
  const lastActive = parseISO(lastActiveDateStr);
  return differenceInCalendarDays(new Date(), lastActive);
}

/**
 * Returns the streak milestone for a given streak count, if one exists.
 * Milestones are used to trigger achievement checks and celebrations.
 */
export function getStreakMilestone(streakCount: number): number | null {
  const milestones = [3, 7, 14, 21, 30, 60, 90, 180, 365];
  return milestones.includes(streakCount) ? streakCount : null;
}

/**
 * Returns a human-readable label for a streak count.
 * Used in UI display.
 */
export function formatStreakLabel(streakCount: number): string {
  if (streakCount === 0) return "No streak yet";
  if (streakCount === 1) return "1 day";
  return `${streakCount} days`;
}

/**
 * Returns the emoji fire intensity based on streak length.
 * Used to make long streaks feel progressively more exciting.
 */
export function getStreakEmoji(streakCount: number): string {
  if (streakCount >= 365) return "🌟";
  if (streakCount >= 90) return "💎";
  if (streakCount >= 30) return "🔥";
  if (streakCount >= 7) return "⚡";
  return "🔥";
}
