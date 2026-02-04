"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Download, RefreshCcw, Share2, Sparkles, Lock, MoveHorizontal } from "lucide-react";
import { Header, Stepper } from "@/components/layout";
import { Button } from "@/components/ui";
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
      // Limit slider movement to 30-70% range (30% from each edge)
      const percentage = Math.max(30, Math.min(70, (x / rect.width) * 100));
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

      <main className="flex-1 px-4 pt-2 pb-8">
        <div className="max-w-lg mx-auto flex flex-col gap-5">
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
                  <Image
                    src={restoredUrl}
                    alt="Foto restaurada"
                    fill
                    sizes="(max-width: 512px) 100vw, 512px"
                    className="object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="h-full w-full bg-ih-surface-warm" />
                )}
                <div className="absolute bottom-4 right-4 rounded-full bg-genea-green px-3 py-1.5 text-xs font-semibold text-white shadow-lg z-10">
                  Depois
                </div>
                {/* Preview indicator for trial */}
                {!showAsPaid && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 z-10">
                    <Lock className="w-3 h-3 text-white/90" />
                    <span className="text-xs font-medium text-white/90">Preview</span>
                  </div>
                )}
              </div>

              {/* Before image (clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                {originalUrl ? (
                  <Image
                    src={originalUrl}
                    alt="Foto original"
                    fill
                    sizes="(max-width: 512px) 100vw, 512px"
                    className="object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="h-full w-full bg-ih-surface" />
                )}
                <div className="absolute bottom-4 left-4 rounded-full bg-ih-text/80 px-3 py-1.5 text-xs font-semibold text-white shadow-lg z-10">
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
            <p className="text-center text-xs text-ih-text-muted mt-2">
              ← Deslize para comparar →
            </p>
          </div>

          {/* Action buttons - prominent CTAs */}
          <div className="flex flex-col gap-3 w-full">
            {showAsPaid ? (
              <>
                <Button onClick={onDownload} className="w-full gap-2 h-14 text-base font-semibold shadow-lg" size="lg">
                  <Download className="w-5 h-5" />
                  Baixar foto restaurada
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={onRequestAdjustment}
                    className="flex-1 gap-2 h-12"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Ajustar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onShare}
                    className="flex-1 gap-2 h-12"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </Button>
                </div>
                <Link href="/upload" className="w-full">
                  <Button
                    variant="secondary"
                    className="w-full gap-2 h-11 text-ih-text-secondary"
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
                {/* Primary CTA: Save restored photo */}
                <div className="flex flex-col items-center gap-1.5">
                  <Button
                    size="lg"
                    onClick={onUnlockThisPhoto}
                    className="w-full h-14 text-base bg-genea-green hover:bg-genea-green/90 border-genea-green text-white font-semibold shadow-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Salvar foto restaurada
                  </Button>
                  <span className="text-xs text-ih-text-muted">
                    R$ 9,90 · Pagamento único · Ajustes ilimitados
                  </span>
                </div>

                {/* Text links */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  <button
                    onClick={onGetMorePhotos}
                    className="text-sm text-genea-amber hover:text-genea-amber/80 transition-colors font-medium"
                  >
                    Tem mais fotos? Veja pacotes com desconto
                  </button>
                  <button
                    onClick={onDownload}
                    className="text-xs text-ih-text-muted hover:text-ih-text-secondary transition-colors"
                  >
                    Baixar amostra com marca d&apos;água
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
