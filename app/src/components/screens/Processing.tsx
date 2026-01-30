"use client";

import { useState, useEffect } from "react";
import { Header, Stepper } from "@/components/layout";
import { Loader2 } from "lucide-react";

interface ProcessingProps {
  previewUrl?: string;
}

const steps = [
  { label: "Enviar", completed: true },
  { label: "Processar", active: true },
  { label: "Resultado" },
];

const rotatingMessages = [
  "Analisando detalhes da foto...",
  "Restaurando cores...",
  "Removendo imperfeições...",
  "Melhorando nitidez...",
  "Ajustando contraste...",
  "Quase pronto...",
];

export function Processing({ previewUrl }: ProcessingProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />
      <Stepper steps={steps} />

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
        {/* Photo preview with loading overlay */}
        <div className="relative">
          {previewUrl ? (
            <div className="relative w-48 h-60 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-card">
              <img
                src={previewUrl}
                alt="Foto sendo processada"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-genea-green animate-spin" />
              </div>
            </div>
          ) : (
            <div className="w-48 h-60 md:w-56 md:h-72 rounded-2xl bg-ih-surface-warm flex items-center justify-center shadow-card">
              <Loader2 className="w-10 h-10 text-genea-green animate-spin" />
            </div>
          )}
        </div>

        {/* Rotating loading text */}
        <div className="text-center min-h-[48px]">
          <p className="text-genea-green font-medium animate-pulse">
            {rotatingMessages[messageIndex]}
          </p>
          <p className="text-sm text-ih-text-muted mt-2">
            Fica aqui que já já sai. Leva menos de 2 minutos.
          </p>
        </div>
      </main>
    </div>
  );
}
