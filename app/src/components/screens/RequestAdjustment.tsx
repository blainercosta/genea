"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui";
import { RefreshCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RequestAdjustmentProps {
  photoUrl?: string;
  credits?: number;
  onSubmit?: (adjustments: string[], customNote: string) => void;
  onCancel?: () => void;
}

const adjustmentOptions = [
  "Clarear mais",
  "Escurecer",
  "Mais contraste",
  "Menos ruído",
  "Mais nitidez",
  "Corrigir cores",
  "Remover manchas",
  "Outro",
];

export function RequestAdjustment({
  photoUrl,
  credits = 2,
  onSubmit,
  onCancel,
}: RequestAdjustmentProps) {
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedAdjustments, setSelectedAdjustments] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState("");

  const toggleAdjustment = (adjustment: string) => {
    setSelectedAdjustments((prev) =>
      prev.includes(adjustment)
        ? prev.filter((a) => a !== adjustment)
        : [...prev, adjustment]
    );
  };

  const handleSubmit = () => {
    onSubmit?.(selectedAdjustments, customNote);
  };

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header showCredits={mounted} credits={credits} />

      <main className="flex-1 p-6 pb-12">
        <div className="max-w-lg mx-auto flex flex-col gap-8 items-center">
          {/* Photo preview - centered */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-48 h-60 md:w-56 md:h-72 rounded-2xl bg-ih-surface-warm shadow-xl overflow-hidden border border-ih-border">
              {photoUrl ? (
                <img src={photoUrl} alt="Foto para ajustar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <RefreshCcw className="w-8 h-8 text-ih-text-muted" />
                </div>
              )}
            </div>
            <p className="text-xs text-ih-text-muted">Resultado atual</p>
          </div>

          {/* Adjustment options */}
          <div className="w-full flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-semibold text-ih-text">
                O que você quer ajustar?
              </h1>
              <p className="text-sm text-ih-text-secondary mt-2">
                Selecione uma ou mais opções e a gente refaz pra você.
              </p>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {adjustmentOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleAdjustment(option)}
                  className={cn(
                    "px-4 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                    selectedAdjustments.includes(option)
                      ? "bg-genea-green text-white shadow-sm"
                      : "bg-ih-surface border border-ih-border text-ih-text hover:border-genea-green hover:bg-genea-green/5"
                  )}
                >
                  {selectedAdjustments.includes(option) && (
                    <Check className="w-4 h-4" />
                  )}
                  {option}
                </button>
              ))}
            </div>

            {/* Custom note */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ih-text text-center">
                Quer explicar melhor? <span className="font-normal text-ih-text-muted">(opcional)</span>
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Ex: Gostaria que o rosto da pessoa à esquerda ficasse mais nítido..."
                className="w-full h-28 rounded-xl border border-ih-border bg-ih-surface px-4 py-3 text-ih-text placeholder:text-ih-text-muted focus:border-genea-green focus:outline-none focus:ring-1 focus:ring-genea-green resize-none"
                maxLength={500}
              />
              <span className="text-xs text-ih-text-muted text-right">
                {customNote.length}/500
              </span>
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              disabled={selectedAdjustments.length === 0}
              className="w-full"
              size="lg"
            >
              Enviar pedido de ajuste
            </Button>

            {/* Guarantee note */}
            <p className="text-sm text-ih-text-muted text-center">
              Ajustes são ilimitados até você aprovar. <span className="text-genea-green font-medium">Sem custo extra.</span>
            </p>

            {/* Cancel link */}
            <Link
              href="/result"
              onClick={onCancel}
              className="text-sm text-ih-text-secondary hover:text-genea-green text-center transition-colors"
            >
              Cancelar e voltar pro resultado
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
