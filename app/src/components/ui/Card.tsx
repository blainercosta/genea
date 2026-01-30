import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "warm";
}

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        variant === "default" && "bg-ih-surface shadow-card",
        variant === "warm" && "bg-ih-surface-warm",
        className
      )}
    >
      {children}
    </div>
  );
}
