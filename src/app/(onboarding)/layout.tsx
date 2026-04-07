import { ProtectedLayout } from "@/components/layout/ProtectedLayout";

// Onboarding pages: auth-protected but no BottomNav.
// AppShell is NOT used here — that would create a redirect loop since
// AppShell redirects incomplete-onboarding users to /onboarding.
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <main className="min-h-screen bg-zinc-950">{children}</main>
    </ProtectedLayout>
  );
}
