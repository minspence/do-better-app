"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Trophy, Users, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Habits", href: "/habits", icon: Dumbbell },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "Social", href: "/social", icon: Users },
  { label: "Profile", href: "/profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    // Safe area padding handles the iPhone home indicator
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-colors",
                isActive
                  ? "text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-110",
                )}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
