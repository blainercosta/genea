"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  text?: string;
  className?: string;
}

export function Loading({ text = "Processando...", className }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3 h-12", className)}>
      <Loader2 className="h-5 w-5 animate-spin text-genea-green" />
      <span className="text-ih-text-secondary">{text}</span>
    </div>
  );
}
