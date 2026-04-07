import { AppShell } from "@/components/layout/AppShell";
import { BottomNav } from "@/components/layout/BottomNav";

// Protected app shell: wraps all authenticated pages with auth + onboarding guard + bottom nav.
// The main content scrolls; the bottom nav stays fixed.
// New users with incomplete onboarding are redirected to /onboarding by AppShell.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      {/* Bottom padding ensures content doesn't hide behind the nav bar */}
      <main className="min-h-screen bg-zinc-950 pb-24">{children}</main>
      <BottomNav />
    </AppShell>
  );
}
