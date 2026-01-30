"use client";

import { useState, useCallback } from "react";
import { Upload, Camera, Image, Lightbulb, CheckCircle } from "lucide-react";
import { Header, Stepper } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  onUpload?: (file: File) => void;
  isPaid?: boolean;
  credits?: number;
}

const steps = [
  { label: "Enviar", active: true },
  { label: "Processar" },
  { label: "Resultado" },
];

export function PhotoUpload({ onUpload, isPaid = false, credits = 0 }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (selectedFile && onUpload) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header showCredits={isPaid} credits={credits} />
      <Stepper steps={steps} />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-semibold text-ih-text">
              Envie sua foto antiga
            </h1>
            <p className="text-ih-text-secondary">
              Pode estar rasgada, manchada ou desbotada. A gente dá um jeito.
            </p>
          </div>

          {/* Upload area */}
          <div
            className={cn(
              "relative flex flex-col items-center justify-center gap-4 p-6 h-72 rounded-2xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden",
              selectedFile
                ? "border-genea-green bg-genea-green/5"
                : "bg-ih-surface-warm border-genea-amber/50 hover:border-genea-amber",
              isDragging && "border-genea-green bg-genea-green/5"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />

            {selectedFile && previewUrl ? (
              <div className="flex flex-col items-center gap-3 w-full h-full relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
                  <CheckCircle className="w-4 h-4 text-genea-green" />
                  <span className="text-sm text-ih-text">Foto selecionada</span>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-genea-amber" />
                <p className="text-ih-text font-medium">Arraste a foto aqui</p>
                <p className="text-sm text-ih-text-muted">ou clique para selecionar</p>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-medium border-2 border-genea-green text-genea-green bg-transparent hover:bg-genea-green hover:text-white transition-all">
                <Camera className="w-4 h-4" />
                <span className="hidden md:inline">Tirar foto</span>
                <span className="md:hidden">Câmera</span>
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-medium border-2 border-genea-green text-genea-green bg-transparent hover:bg-genea-green hover:text-white transition-all">
                <Image className="w-4 h-4" />
                <span>Galeria</span>
              </div>
            </label>
          </div>

          {/* Tip */}
          <Card variant="default" className="flex items-center gap-3 p-4 rounded-xl border border-ih-border">
            <Lightbulb className="w-5 h-5 text-genea-amber flex-shrink-0" />
            <p className="text-sm text-ih-text-secondary">
              Quanto melhor a qualidade da foto original, melhor o resultado.
            </p>
          </Card>

          {/* Submit button */}
          {selectedFile && (
            <Button onClick={handleSubmit} className="w-full" size="lg">
              {isPaid ? "Restaurar foto" : "Restaurar grátis"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
