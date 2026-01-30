"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-medium text-ih-text">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-ih-border bg-ih-surface px-4 py-3",
            "text-ih-text placeholder:text-ih-text-muted",
            "focus:border-genea-green focus:outline-none focus:ring-1 focus:ring-genea-green",
            "transition-colors",
            error && "border-ih-negative focus:border-ih-negative focus:ring-ih-negative",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-ih-negative">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
