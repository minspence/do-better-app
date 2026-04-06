import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging Tailwind classes safely.
// Handles conditional classes and resolves conflicts (e.g., bg-red-500 + bg-blue-500 → bg-blue-500)
//
// Usage:
//   cn("px-4 py-2", isActive && "bg-blue-500", "rounded-lg")
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
