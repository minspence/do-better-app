import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: "indigo" | "orange" | "green" | "blue" | "purple";
}

const colorStyles: Record<NonNullable<ProgressBarProps["color"]>, string> = {
  indigo: "bg-indigo-500",
  orange: "bg-orange-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

const sizeStyles: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  className,
  barClassName,
  showLabel = false,
  label,
  size = "md",
  color = "indigo",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
          <span>{label ?? "Progress"}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-zinc-800",
          sizeStyles[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorStyles[color],
            barClassName,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
