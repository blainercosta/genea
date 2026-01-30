"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  variant?: "default" | "danger";
  children?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  variant = "default",
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-ih-surface p-6 shadow-card border border-ih-border">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-ih-text-muted hover:text-ih-text"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-ih-text">{title}</h2>
        {description && (
          <p className="mt-2 text-ih-text-secondary">{description}</p>
        )}

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className={cn("flex-1", variant === "danger" && "bg-ih-negative hover:bg-ih-negative/90")}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
