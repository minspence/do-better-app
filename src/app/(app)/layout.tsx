import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { BottomNav } from "@/components/layout/BottomNav";

// Protected app shell: wraps all authenticated pages with auth guard + bottom nav.
// The main content scrolls; the bottom nav stays fixed.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      {/* Bottom padding ensures content doesn't hide behind the nav bar */}
      <main className="min-h-screen bg-zinc-950 pb-24">{children}</main>
      <BottomNav />
    </ProtectedLayout>
  );
}
