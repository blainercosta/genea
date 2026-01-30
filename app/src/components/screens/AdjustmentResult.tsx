"use client";

import { Download, RefreshCcw, ThumbsUp, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui";
import Link from "next/link";

interface AdjustmentResultProps {
  previousUrl?: string;
  adjustedUrl?: string;
  credits?: number;
  onApprove?: () => void;
  onRequestMore?: () => void;
  onDownload?: () => void;
}

export function AdjustmentResult({
  previousUrl,
  adjustedUrl,
  credits = 2,
  onApprove,
  onRequestMore,
  onDownload,
}: AdjustmentResultProps) {
  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header showCredits credits={credits} />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center min-h-[60vh]">
          {/* Left: Image comparison */}
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold text-ih-text text-center">
              Ficou melhor?
            </h1>

            {/* Before/After comparison */}
            <div className="flex items-center gap-4">
              {/* Previous version */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-36 h-44 md:w-44 md:h-56 rounded-xl bg-ih-surface-warm border border-ih-border overflow-hidden">
                  {previousUrl ? (
                    <img src={previousUrl} alt="Versão anterior" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-ih-text-muted">Anterior</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-ih-text-muted">Antes do ajuste</p>
              </div>

              <ArrowRight className="w-5 h-5 text-ih-text-muted flex-shrink-0" />

              {/* Adjusted version */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-36 h-44 md:w-44 md:h-56 rounded-xl bg-ih-surface shadow-card overflow-hidden border-2 border-genea-green">
                  {adjustedUrl ? (
                    <img src={adjustedUrl} alt="Foto ajustada" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-ih-text-muted">Ajustada</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-genea-green font-medium">Depois do ajuste</p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="w-full lg:w-80 flex flex-col gap-4">
            <p className="text-ih-text-secondary text-center lg:text-left mb-2">
              Se ficou do jeito que você queria, aprova o resultado. Se não, pede mais ajustes.
            </p>

            <Button onClick={onApprove} className="w-full gap-2" size="lg">
              <ThumbsUp className="w-4 h-4" />
              Aprovar resultado
            </Button>

            <Button onClick={onDownload} variant="secondary" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Baixar foto
            </Button>

            <Link href="/adjust" className="w-full">
              <Button onClick={onRequestMore} variant="ghost" className="w-full gap-2">
                <RefreshCcw className="w-4 h-4" />
                Pedir mais ajustes
              </Button>
            </Link>

            <p className="text-xs text-ih-text-muted text-center mt-2">
              Ajustes ilimitados até você aprovar.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
