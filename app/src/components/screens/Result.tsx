"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Download, RefreshCcw, Share2, Sparkles, Lock, CheckCircle2, MoveHorizontal } from "lucide-react";
import { Header, Stepper } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ResultProps {
  originalUrl?: string;
  restoredUrl?: string;
  isPaid?: boolean;
  credits?: number;
  restorationId?: string;
  onDownload?: () => void;
  onRequestAdjustment?: () => void;
  onShare?: () => void;
  onUpgrade?: () => void;
  onUnlockThisPhoto?: () => void;
  onGetMorePhotos?: () => void;
}

const steps = [
  { label: "Enviar", completed: true },
  { label: "Processar", completed: true },
  { label: "Resultado", active: true, completed: true },
];

export function Result({
  originalUrl,
  restoredUrl,
  isPaid = false,
  credits = 0,
  restorationId,
  onDownload,
  onRequestAdjustment,
  onShare,
  onUpgrade,
  onUnlockThisPhoto,
  onGetMorePhotos,
}: ResultProps) {
  // Prevent hydration mismatch - render consistent UI on first render
  // Always render as "trial" on server, then update to actual state on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use trial state until mounted to prevent hydration mismatch
  const showAsPaid = mounted && isPaid;

  // Slider state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header showCredits={showAsPaid} credits={credits} />
      <Stepper steps={steps} />

      <main className="flex-1 p-6 pb-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {/* Success header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-genea-green/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-genea-green" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-ih-text">
              {showAsPaid ? "Mais uma memória salva!" : "Olha como ficou!"}
            </h1>
            <p className="text-ih-text-secondary max-w-md">
              {showAsPaid
                ? "Arraste para comparar. Baixe ou solicite ajustes."
                : "Arraste para comparar. Desbloqueie para baixar sem marca d'água."
              }
            </p>
          </div>

          {/* Before/After Slider - Main highlight */}
          <div className="w-full">
            <div
              ref={containerRef}
              className="relative aspect-[3/4] w-full cursor-ew-resize overflow-hidden rounded-2xl bg-ih-surface-warm select-none shadow-xl ring-1 ring-ih-border/50"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
            >
              {/* After image (full width, underneath) */}
              <div className="absolute inset-0">
                {restoredUrl ? (
                  <img
                    src={restoredUrl}
                    alt="Foto restaurada"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="h-full w-full bg-ih-surface-warm" />
                )}
                <div className="absolute bottom-4 right-4 rounded-full bg-genea-green px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                  Depois
                </div>
                {/* Watermark indicator for trial */}
                {!showAsPaid && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5">
                    <Lock className="w-3 h-3 text-white/90" />
                    <span className="text-xs font-medium text-white/90">Com marca d&apos;água</span>
                  </div>
                )}
              </div>

              {/* Before image (clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                {originalUrl ? (
                  <img
                    src={originalUrl}
                    alt="Foto original"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="h-full w-full bg-ih-surface" />
                )}
                <div className="absolute bottom-4 left-4 rounded-full bg-ih-text/80 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                  Antes
                </div>
              </div>

              {/* Divider line with handle */}
              <div
                className="absolute top-0 bottom-0 z-10 flex items-center"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute h-full w-0.5 bg-white shadow-lg" />
                <button
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl transition-all",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-genea-green/50",
                    isDragging && "scale-110"
                  )}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                  onTouchEnd={handleMouseUp}
                  aria-label="Arrastar para comparar antes e depois"
                >
                  <MoveHorizontal className="h-5 w-5 text-ih-text" />
                </button>
              </div>
            </div>

            {/* Hint text */}
            <p className="text-center text-sm text-ih-text-muted mt-3">
              Arraste o controle para comparar
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-4 w-full">
            {showAsPaid ? (
              <>
                <Button onClick={onDownload} className="w-full gap-2" size="lg">
                  <Download className="w-4 h-4" />
                  Baixar foto restaurada
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={onRequestAdjustment}
                    className="flex-1 gap-2 bg-ih-surface hover:bg-ih-surface-warm"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Ajustar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onShare}
                    className="flex-1 gap-2 bg-ih-surface hover:bg-ih-surface-warm"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </Button>
                </div>
                <Link href="/upload" className="w-full">
                  <Button
                    variant="secondary"
                    className="w-full gap-2 bg-transparent hover:bg-ih-surface-warm text-ih-text-secondary"
                  >
                    <Sparkles className="w-4 h-4" />
                    Restaurar outra foto
                  </Button>
                </Link>
                {credits > 0 && (
                  <p className="text-xs text-ih-text-muted text-center">
                    Você ainda tem {credits} {credits === 1 ? "crédito" : "créditos"}
                  </p>
                )}
              </>
            ) : (
              <>
                {/* Upsell CTA */}
                <Card variant="warm" className="p-5 flex flex-col gap-4 border-2 border-genea-amber/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-genea-amber/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-genea-amber" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ih-text">
                        Quer sem marca d&apos;água?
                      </h3>
                      <p className="text-sm text-ih-text-secondary">
                        Download em alta qualidade + ajustes ilimitados
                      </p>
                    </div>
                  </div>

                  {/* Primary CTA: Unlock just this photo */}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onUnlockThisPhoto}
                    className="w-full bg-genea-amber hover:bg-genea-amber/90 border-genea-amber text-white font-semibold"
                  >
                    Alterar somente esta • R$ 9,90
                  </Button>

                  {/* Secondary CTA: Get more photos */}
                  <Button
                    variant="secondary"
                    onClick={onGetMorePhotos}
                    className="w-full bg-ih-surface hover:bg-ih-surface-warm"
                  >
                    Quero esta e outras
                  </Button>

                  <p className="text-xs text-ih-text-muted text-center">
                    Pagamento único • Sem assinatura
                  </p>
                </Card>

                <Button
                  variant="secondary"
                  onClick={onDownload}
                  className="w-full gap-2 bg-ih-surface hover:bg-ih-surface-warm"
                >
                  <Download className="w-4 h-4" />
                  Baixar com marca d&apos;água
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
