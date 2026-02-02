"use client";

import { useState } from "react";
import { Sparkles, Clock, Lock, Download, Eye } from "lucide-react";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Restoration } from "@/types";

interface DashboardProps {
  userName?: string;
  userEmail?: string;
  credits?: number;
  isTrialAvailable?: boolean;
  restorations?: Restoration[];
  onNewRestoration?: () => void;
  onViewRestoration?: (restorationId: string) => void;
  onDownloadRestoration?: (restoration: Restoration) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function RestorationCard({
  restoration,
  onView,
  onDownload,
}: {
  restoration: Restoration;
  onView?: () => void;
  onDownload?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isPaid = !restoration.isTrial;
  const isCompleted = restoration.status === "completed";

  return (
    <div
      className="relative aspect-[3/4] rounded-xl overflow-hidden bg-ih-surface-warm cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onView}
    >
      {/* Image */}
      {restoration.restoredUrl ? (
        <img
          src={restoration.restoredUrl}
          alt="Foto restaurada"
          className="w-full h-full object-cover"
        />
      ) : restoration.originalUrl ? (
        <img
          src={restoration.originalUrl}
          alt="Foto original"
          className="w-full h-full object-cover opacity-60"
        />
      ) : (
        <div className="w-full h-full bg-ih-surface-warm" />
      )}

      {/* Status overlay */}
      {!isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4 text-genea-amber animate-pulse" />
            <span className="text-sm font-medium text-ih-text">Processando</span>
          </div>
        </div>
      )}

      {/* Trial badge */}
      {!isPaid && isCompleted && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full">
          <Lock className="w-3 h-3 text-white/90" />
          <span className="text-xs text-white/90">Trial</span>
        </div>
      )}

      {/* Hover overlay with actions */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 transition-opacity",
          isHovered && isCompleted ? "opacity-100" : "opacity-0"
        )}
      >
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onView?.();
          }}
          className="gap-1.5 bg-white/90 hover:bg-white text-ih-text"
        >
          <Eye className="w-4 h-4" />
          Ver
        </Button>
        {isPaid && (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.();
            }}
            className="gap-1.5 bg-white/90 hover:bg-white text-ih-text"
          >
            <Download className="w-4 h-4" />
            Baixar
          </Button>
        )}
      </div>

      {/* Date badge */}
      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-full">
        <span className="text-xs text-white/90">{formatDate(restoration.createdAt)}</span>
      </div>
    </div>
  );
}

export function Dashboard({
  userName,
  userEmail,
  credits = 0,
  isTrialAvailable = false,
  restorations = [],
  onNewRestoration,
  onViewRestoration,
  onDownloadRestoration,
}: DashboardProps) {
  const displayName = userName || userEmail?.split("@")[0] || "você";
  const hasRestorations = restorations.length > 0;
  const completedRestorations = restorations.filter((r) => r.status === "completed");

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {/* Welcome section */}
          <div className="flex flex-col items-center text-center gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-ih-text">
              Olá, {displayName}!
            </h1>
            <p className="text-ih-text-secondary max-w-md">
              {hasRestorations
                ? "Suas memórias restauradas estão aqui."
                : "Pronto para trazer uma memória de volta?"}
            </p>
          </div>

          {/* Main CTA */}
          <div className="flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={onNewRestoration}
              className="h-14 px-8 text-base font-semibold shadow-lg gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {isTrialAvailable ? "Restaurar foto grátis" : "Nova restauração"}
            </Button>

            {/* Credits info */}
            <p className="text-sm text-ih-text-muted">
              {isTrialAvailable ? (
                "Sua primeira foto é grátis!"
              ) : credits > 0 ? (
                <>
                  Você tem{" "}
                  <span className="font-semibold text-genea-green">
                    {credits} {credits === 1 ? "crédito" : "créditos"}
                  </span>
                </>
              ) : (
                "Sem créditos disponíveis"
              )}
            </p>
          </div>

          {/* Gallery section */}
          {hasRestorations && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ih-text">
                  Suas restaurações
                </h2>
                <span className="text-sm text-ih-text-muted">
                  {completedRestorations.length}{" "}
                  {completedRestorations.length === 1 ? "foto" : "fotos"}
                </span>
              </div>

              {/* Grid of restorations */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {restorations.map((restoration) => (
                  <RestorationCard
                    key={restoration.id}
                    restoration={restoration}
                    onView={() => onViewRestoration?.(restoration.id)}
                    onDownload={() => onDownloadRestoration?.(restoration)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {!hasRestorations && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 rounded-full bg-ih-surface-warm flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-genea-amber" />
              </div>
              <p className="text-ih-text-secondary max-w-sm">
                Nenhuma foto ainda. Que tal começar com aquela foto especial?
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
