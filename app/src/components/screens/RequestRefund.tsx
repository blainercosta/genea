"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Card } from "@/components/ui";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface RequestRefundProps {
  onSubmit?: (reason: string, details: string, pixKey: string) => void;
  onCancel?: () => void;
}

const refundReasons = [
  "Não gostei do resultado",
  "Qualidade abaixo do esperado",
  "Demorou demais",
  "Comprei por engano",
  "Outro motivo",
];

export function RequestRefund({ onSubmit, onCancel }: RequestRefundProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [pixKey, setPixKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(selectedReason, details, pixKey);
  };

  const isValid = selectedReason && pixKey;

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-6 md:p-8 flex flex-col gap-6 border border-ih-border">
          {/* Title */}
          <div className="flex flex-col gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-genea-amber/10 flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-6 h-6 text-genea-amber" />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-ih-text">
              Solicitar reembolso
            </h1>
            <p className="text-sm text-ih-text-secondary">
              Sentimos muito que não tenha dado certo. Conta pra gente o que aconteceu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Reason dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ih-text">Motivo</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full rounded-xl border border-ih-border bg-ih-surface px-4 py-3 text-ih-text focus:border-genea-green focus:outline-none focus:ring-1 focus:ring-genea-green appearance-none cursor-pointer"
              >
                <option value="">Selecione um motivo</option>
                {refundReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Details textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ih-text">
                Detalhes <span className="font-normal text-ih-text-muted">(opcional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Nos ajude a entender melhor..."
                className="w-full h-24 rounded-xl border border-ih-border bg-ih-surface px-4 py-3 text-ih-text placeholder:text-ih-text-muted focus:border-genea-green focus:outline-none focus:ring-1 focus:ring-genea-green resize-none"
              />
            </div>

            {/* PIX key */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ih-text">
                Chave PIX para reembolso
              </label>
              <Input
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="CPF, email ou telefone"
              />
              <p className="text-xs text-ih-text-muted">
                Usamos essa chave pra devolver seu dinheiro via PIX.
              </p>
            </div>

            {/* Info text */}
            <div className="bg-genea-amber/10 rounded-xl p-4 text-center">
              <p className="text-sm text-ih-text">
                A gente devolve o valor total em até <span className="font-medium">24 horas úteis</span> via PIX.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={!isValid} className="w-full" size="lg">
                Solicitar reembolso
              </Button>
              <Link href="/" className="w-full">
                <Button type="button" variant="ghost" onClick={onCancel} className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>

            {/* Policy note */}
            <p className="text-xs text-ih-text-muted text-center">
              Ao solicitar, você concorda com nossa{" "}
              <a href="/politica-reembolso" className="text-genea-green hover:underline">
                política de reembolso
              </a>.
            </p>
          </form>
        </Card>
      </main>
    </div>
  );
}
