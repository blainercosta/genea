"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastVariant = "success" | "error";

interface ToastProps {
  variant: ToastVariant;
  message: string;
  onClose?: () => void;
  className?: string;
}

const variantConfig: Record<ToastVariant, { icon: React.ReactNode; borderColor: string }> = {
  success: {
    icon: <CheckCircle className="h-5 w-5 text-ih-positive" />,
    borderColor: "border-ih-positive",
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-ih-negative" />,
    borderColor: "border-ih-negative",
  },
};

export function Toast({ variant, message, onClose, className }: ToastProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl bg-ih-surface border px-4 h-14 shadow-toast",
        config.borderColor,
        className
      )}
    >
      {config.icon}
      <span className="flex-1 text-sm text-ih-text">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-ih-text-muted hover:text-ih-text">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
