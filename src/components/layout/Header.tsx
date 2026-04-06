import { cn } from "@/lib/utils/cn";

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}

// Simple page header used at the top of each app screen.
// The `right` prop lets you slot in action buttons (e.g. a + button to add a habit).
export function Header({ title, subtitle, right, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 pb-4 pt-6",
        className,
      )}
    >
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}
