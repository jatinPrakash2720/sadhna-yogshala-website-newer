import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
  variant?: "green" | "gold" | "gray" | "red" | "blue" | "dark";
}

export function Badge({ className, children, variant = "green" }: BadgeProps) {
  const variants = {
    green: "bg-brand-100 text-brand-700",
    gold: "bg-earth-100 text-earth-700",
    gray: "bg-sage-100 text-sage-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    dark: "bg-white/10 text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
