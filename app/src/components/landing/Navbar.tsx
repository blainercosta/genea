"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#precos", label: "Preços" },
  { href: "#duvidas", label: "Dúvidas" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-card-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <button
          onClick={scrollToTop}
          className="hover:opacity-80 transition-opacity focus:outline-none focus-visible:opacity-80"
          aria-label="Voltar ao topo"
        >
          <img src="/images/logo-t.svg" alt="Genea" className="h-10" />
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-ih-text-secondary hover:text-genea-green transition-colors font-medium py-2 focus:outline-none focus-visible:text-genea-green"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <Link href="/start" className="hidden sm:flex">
          <Button size="sm">Testar Grátis</Button>
        </Link>

        {/* Mobile CTA */}
        <Link href="/start" className="sm:hidden">
          <Button size="sm">Testar</Button>
        </Link>
      </div>
    </nav>
  );
}
