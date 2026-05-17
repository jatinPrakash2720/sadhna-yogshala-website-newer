import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-brand hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-brand-500",
      secondary:
        "bg-white hover:bg-brand-50 text-brand-700 border border-brand-200 hover:border-brand-400 hover:-translate-y-0.5 focus-visible:ring-brand-400",
      ghost:
        "text-sage-600 hover:text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-400",
      accent:
        "bg-earth-500 hover:bg-earth-600 text-white hover:-translate-y-0.5 focus-visible:ring-earth-400",
      danger:
        "bg-red-600 hover:bg-red-700 text-white hover:-translate-y-0.5 focus-visible:ring-red-500",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
