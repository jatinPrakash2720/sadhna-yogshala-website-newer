import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
  dark?: boolean;
  onClick?: () => void;
}

export function Card({ className, children, hover = false, glass = false, dark = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border transition-all duration-300",
        dark ? "bg-[#152515] border-white/8" : "bg-white border-cream-200",
        hover && "cursor-pointer hover:shadow-card-hover hover:-translate-y-1",
        glass && "glass",
        !hover && "shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return <div className={cn("p-6 pb-0", className)}>{children}</div>;
}

export function CardContent({ className, children }: CardHeaderProps) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardFooter({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("px-6 pb-6 pt-0 flex items-center gap-3", className)}>
      {children}
    </div>
  );
}
