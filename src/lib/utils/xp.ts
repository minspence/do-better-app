import type { LevelInfo } from "@/types/app.types";

// ─── XP & Leveling System ────────────────────────────────────────────────────
//
// Level progression uses a quadratic curve so early levels feel fast
// (rewarding) while higher levels require meaningful effort.
//
// Formula: XP required for level N = BASE_XP * (N - 1)^EXPONENT
//
// Level 1:   0 XP
// Level 2:   100 XP
// Level 3:   283 XP
// Level 5:   669 XP
// Level 10:  1,900 XP
// Level 20:  5,770 XP
// Level 50:  24,900 XP

const BASE_XP = 100;
const EXPONENT = 1.5;

// XP thresholds for level titles — feel free to customize these
const LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: "Newcomer" },
  { minLevel: 5, title: "Apprentice" },
  { minLevel: 10, title: "Committed" },
  { minLevel: 20, title: "Dedicated" },
  { minLevel: 30, title: "Disciplined" },
  { minLevel: 50, title: "Elite" },
  { minLevel: 75, title: "Master" },
  { minLevel: 100, title: "Legend" },
];

/** Total XP required to reach a given level (cumulative from level 1) */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(BASE_XP * Math.pow(level - 1, EXPONENT));
}

/** XP required to go from the start of `level` to the start of `level + 1` */
export function xpRequiredForLevelUp(level: number): number {
  return xpRequiredForLevel(level + 1) - xpRequiredForLevel(level);
}

/** Compute level from total accumulated XP */
export function levelFromXP(totalXP: number): number {
  let level = 1;
  while (xpRequiredForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

/** Get the title for a given level */
export function getTitleForLevel(level: number): string {
  const entry = [...LEVEL_TITLES].reverse().find((t) => level >= t.minLevel);
  return entry?.title ?? "Newcomer";
}

/**
 * Given total XP, compute all level display info needed by the UI.
 *
 * @example
 * const info = getLevelInfo(450);
 * // { level: 4, currentXP: 450, xpForCurrentLevel: 383, xpForNextLevel: 583,
 * //   progressPercent: 33.5, title: "Apprentice" }
 */
export function getLevelInfo(totalXP: number): LevelInfo {
  const level = levelFromXP(totalXP);
  const xpForCurrentLevel = xpRequiredForLevel(level);
  const xpForNextLevel = xpRequiredForLevel(level + 1);
  const xpIntoCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = Math.min(
    100,
    Math.floor((xpIntoCurrentLevel / xpNeededForNextLevel) * 100),
  );

  return {
    level,
    currentXP: totalXP,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPercent,
    title: getTitleForLevel(level),
  };
}
