"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, Plus, LogOut, User, ChevronDown, Images } from "lucide-react";
import { useUser } from "@/hooks";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  showCredits?: boolean;
  credits?: number;
  className?: string;
}

export function Header({ showCredits = false, credits: propCredits, className }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, credits: hookCredits, clearData, isLoading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use prop credits if explicitly passed, otherwise use hook credits
  const displayCredits = propCredits !== undefined ? propCredits : hookCredits;

  // Determine if user is logged in (has email)
  const isLoggedIn = mounted && !!user?.email;

  // Show user menu on all pages except landing/home
  const shouldShowUserSection = mounted && pathname !== "/";

  const handleLogout = () => {
    clearData();
    setIsMenuOpen(false);
    router.push("/");
  };

  const handleAddCredits = () => {
    setIsMenuOpen(false);
    router.push("/checkout?source=header");
  };

  const handleGallery = () => {
    setIsMenuOpen(false);
    router.push("/dashboard");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest("[data-user-menu]")) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "flex items-center justify-between h-14 md:h-16 px-4 md:px-12 w-full",
        className
      )}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image src="/images/logo-t.svg" alt="Genea" width={108} height={36} className="h-8 md:h-9 w-auto" />
      </Link>

      {/* User section - shown on all pages except home */}
      {shouldShowUserSection && (
        <div className="flex items-center gap-2" data-user-menu>
          {isLoggedIn ? (
            <>
              {/* Credits display - always visible */}
              <div className="flex items-center gap-1.5 rounded-full bg-ih-surface px-3 py-1.5 shadow-sm border border-ih-border">
                <ImageIcon className="w-4 h-4 text-genea-green" />
                <span className="text-sm font-semibold text-genea-green">{displayCredits}</span>
                <span className="hidden sm:inline text-xs text-ih-text-muted">
                  {displayCredits === 1 ? "crédito" : "créditos"}
                </span>
              </div>

              {/* Add credits button - shown when credits = 0 */}
              {displayCredits === 0 && (
                <button
                  onClick={handleAddCredits}
                  className="flex items-center gap-1 rounded-full bg-genea-green px-3 py-1.5 text-white text-sm font-medium shadow-sm hover:bg-genea-green/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Adicionar</span>
                </button>
              )}

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full bg-ih-surface px-3 py-1.5 shadow-sm border border-ih-border hover:bg-ih-surface-warm transition-colors",
                    isMenuOpen && "bg-ih-surface-warm"
                  )}
                >
                  <User className="w-4 h-4 text-ih-text-secondary" />
                  <ChevronDown className={cn(
                    "w-3 h-3 text-ih-text-muted transition-transform",
                    isMenuOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white shadow-lg border border-ih-border py-1 z-50">
                    {/* User email */}
                    <div className="px-4 py-2 border-b border-ih-border">
                      <p className="text-xs text-ih-text-muted truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Gallery option */}
                    <button
                      onClick={handleGallery}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-ih-text hover:bg-ih-surface transition-colors"
                    >
                      <Images className="w-4 h-4 text-genea-green" />
                      Minhas fotos
                    </button>

                    {/* Add credits option */}
                    <button
                      onClick={handleAddCredits}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-ih-text hover:bg-ih-surface transition-colors"
                    >
                      <Plus className="w-4 h-4 text-genea-green" />
                      Adicionar créditos
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Not logged in - show simple credits if passed via props */
            showCredits && (
              <div className="flex items-center gap-2 rounded-full bg-ih-surface px-4 py-2 shadow-sm border border-ih-border">
                <ImageIcon className="w-4 h-4 text-genea-green" />
                <span className="text-sm font-semibold text-genea-green">{displayCredits}</span>
                <span className="text-xs text-ih-text-muted">
                  {displayCredits === 1 ? "crédito" : "créditos"}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </header>
  );
}
