// Auth layout — no bottom nav, centered content, clean background.
// Shared by login and signup pages.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      {children}
    </main>
  );
}
