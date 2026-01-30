"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-genea-green text-white hover:bg-genea-green-hover",
  secondary: "border-2 border-genea-green text-genea-green bg-transparent hover:bg-genea-green hover:text-white",
  ghost: "text-genea-green hover:bg-genea-green/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl font-medium transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-genea-green/50 focus-visible:ring-offset-2",
        "active:scale-[0.98]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
