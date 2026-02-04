"use client";

import { Download } from "lucide-react";

interface ResultCTASectionProps {
  onSavePhoto: () => void;
  onViewPackages: () => void;
  onDownloadSample: () => void;
}

export function ResultCTASection({
  onSavePhoto,
  onViewPackages,
  onDownloadSample,
}: ResultCTASectionProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto">
      {/* Primary CTA Button */}
      <button
        onClick={onSavePhoto}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#4a5d4a] hover:bg-[#3d4d3d] text-white font-semibold text-base rounded-xl transition-colors shadow-lg"
      >
        <Download className="w-5 h-5" />
        Salvar foto restaurada
      </button>

      {/* Subtext */}
      <p className="mt-2 text-xs text-gray-500 text-center">
        R$ 9,90 · Pagamento único · Ajustes ilimitados
      </p>

      {/* Secondary Link */}
      <button
        onClick={onViewPackages}
        className="mt-6 text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors cursor-pointer"
      >
        Tem mais fotos? Veja pacotes com desconto
      </button>

      {/* Tertiary Link */}
      <button
        onClick={onDownloadSample}
        className="mt-4 text-xs text-gray-400 hover:text-gray-500 underline decoration-gray-300 hover:decoration-gray-400 transition-colors cursor-pointer"
      >
        Baixar amostra com marca d&apos;água
      </button>
    </div>
  );
}
