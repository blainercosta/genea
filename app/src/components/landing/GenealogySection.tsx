"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useScrollAnimation } from "@/hooks";
import { cn } from "@/lib/utils";

export function GenealogySection() {
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation();
  const { ref: illustrationMobileRef, isVisible: illustrationMobileVisible } = useScrollAnimation();
  const { ref: illustrationDesktopRef, isVisible: illustrationDesktopVisible } = useScrollAnimation();

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-ih-surface-warm">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Mobile: Illustration first */}
          <div
            ref={illustrationMobileRef}
            className={cn(
              "lg:hidden opacity-0",
              illustrationMobileVisible && "animate-scale-in"
            )}
          >
            <FamilyTreeIllustration />
          </div>

          {/* Text Column */}
          <div ref={textRef} className="space-y-6">
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold text-ih-text opacity-0",
                textVisible && "animate-fade-up"
              )}
            >
              Montando sua árvore genealógica?
            </h2>

            <p
              className={cn(
                "text-lg text-ih-text-secondary leading-relaxed opacity-0",
                textVisible && "animate-fade-up"
              )}
              style={{ animationDelay: textVisible ? "100ms" : "0ms" }}
            >
              Se você pesquisa a história da sua família, sabe como é difícil achar fotos dos antepassados. E quando acha, muitas vezes estão destruídas.
            </p>

            <p
              className={cn(
                "text-lg text-ih-text-secondary leading-relaxed opacity-0",
                textVisible && "animate-fade-up"
              )}
              style={{ animationDelay: textVisible ? "200ms" : "0ms" }}
            >
              A gente ajuda a recuperar rostos que você nunca viu direito. Bisavós, tataravós, parentes que só existiam em histórias.
            </p>

            {/* Highlight Quote */}
            <div
              className={cn(
                "border-l-4 border-genea-green pl-4 py-2 opacity-0",
                textVisible && "animate-slide-right"
              )}
              style={{ animationDelay: textVisible ? "300ms" : "0ms" }}
            >
              <p className="text-lg font-medium text-ih-text italic">
                Agora você pode ver como eles eram de verdade.
              </p>
            </div>

            <div
              className={cn(
                "opacity-0",
                textVisible && "animate-fade-up"
              )}
              style={{ animationDelay: textVisible ? "400ms" : "0ms" }}
            >
              <Link href="/start">
                <Button variant="secondary" size="lg">
                  Começar a restaurar
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop: Illustration */}
          <div
            ref={illustrationDesktopRef}
            className={cn(
              "hidden lg:block opacity-0",
              illustrationDesktopVisible && "animate-slide-left"
            )}
          >
            <FamilyTreeIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function FamilyTreeIllustration({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 400 350" className="w-full h-auto">
        {/* Tree trunk and branches */}
        <path
          d="M200 350 L200 280 M200 280 L200 220 M200 220 L120 160 M200 220 L280 160 M120 160 L80 100 M120 160 L160 100 M280 160 L240 100 M280 160 L320 100"
          stroke="#4A5D4A"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Leaves/decorations */}
        <circle cx="200" cy="220" r="8" fill="#4A5D4A" opacity="0.3" />
        <circle cx="120" cy="160" r="6" fill="#4A5D4A" opacity="0.3" />
        <circle cx="280" cy="160" r="6" fill="#4A5D4A" opacity="0.3" />

        {/* Photo circles - Generation 1 (bottom) */}
        <circle cx="200" cy="280" r="35" fill="#FAF8F4" stroke="#4A5D4A" strokeWidth="3" />
        <circle cx="200" cy="280" r="28" fill="#D4A574" opacity="0.3" />
        <text x="200" y="285" textAnchor="middle" className="text-xs fill-genea-green font-medium">Você</text>

        {/* Generation 2 */}
        <circle cx="120" cy="160" r="30" fill="#FAF8F4" stroke="#4A5D4A" strokeWidth="3" />
        <circle cx="120" cy="160" r="23" fill="#D4A574" opacity="0.3" />

        <circle cx="280" cy="160" r="30" fill="#FAF8F4" stroke="#4A5D4A" strokeWidth="3" />
        <circle cx="280" cy="160" r="23" fill="#D4A574" opacity="0.3" />

        {/* Generation 3 */}
        <circle cx="80" cy="100" r="25" fill="#FAF8F4" stroke="#4A5D4A" strokeWidth="3" />
        <circle cx="80" cy="100" r="18" fill="#D4A574" opacity="0.3" />

        <circle cx="160" cy="100" r="25" fill="#FAF8F4" stroke="#4A5D4A" strokeWidth="3" />
        <circle cx="160" cy="100" r="18" fill="#D4A574" opacity="0.3" />

        <circle cx="240" cy="100" r="25" fill="#FAF8F4" stroke="#4A5D4A" strokeWidth="3" />
        <circle cx="240" cy="100" r="18" fill="#D4A574" opacity="0.3" />

        <circle cx="320" cy="100" r="25" fill="#FAF8F4" stroke="#4A5D4A" strokeWidth="3" />
        <circle cx="320" cy="100" r="18" fill="#D4A574" opacity="0.3" />

        {/* Generation labels */}
        <text x="120" y="205" textAnchor="middle" className="text-[10px] fill-ih-text-secondary">Pais</text>
        <text x="280" y="205" textAnchor="middle" className="text-[10px] fill-ih-text-secondary">Pais</text>
        <text x="120" cy="55" textAnchor="middle" className="text-[10px] fill-ih-text-secondary">Avós</text>
      </svg>

      {/* Decorative text */}
      <p className="text-center text-sm text-ih-text-muted mt-4 italic">
        Cada círculo, uma história para descobrir
      </p>
    </div>
  );
}
