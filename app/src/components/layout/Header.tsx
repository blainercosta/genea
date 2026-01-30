"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

interface HeaderProps {
  showCredits?: boolean;
  credits?: number;
  className?: string;
}

export function Header({ showCredits = false, credits = 0, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between h-14 md:h-16 px-6 md:px-12 w-full",
        className
      )}
    >
      <Link href="/" className="flex items-center gap-2">
        <img src="/images/logo-t.svg" alt="Genea" className="h-8 md:h-9" />
      </Link>

      {showCredits && (
        <div className="flex items-center gap-2 rounded-full bg-ih-surface px-4 py-2 shadow-sm border border-ih-border">
          <ImageIcon className="w-4 h-4 text-genea-green" />
          <span className="text-sm font-semibold text-genea-green">{credits}</span>
          <span className="text-xs text-ih-text-muted">
            {credits === 1 ? "crédito" : "créditos"}
          </span>
        </div>
      )}
    </header>
  );
}
