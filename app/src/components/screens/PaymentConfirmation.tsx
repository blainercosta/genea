"use client";

import { CheckCircle, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

interface PaymentConfirmationProps {
  photos: number;
  amount: number;
  onStartRestoring?: () => void;
}

export function PaymentConfirmation({
  photos = 5,
  amount = 29.9,
  onStartRestoring,
}: PaymentConfirmationProps) {
  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header showCredits credits={photos} />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-8 max-w-md w-full">
          {/* Success icon */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-genea-green flex items-center justify-center shadow-lg">
            <CheckCircle className="w-12 h-12 md:w-14 md:h-14 text-white" />
          </div>

          {/* Title */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-ih-text">
              Pagamento confirmado!
            </h1>
            <p className="text-ih-text-secondary">
              Seus créditos já estão na conta. Bora restaurar?
            </p>
          </div>

          {/* Summary card */}
          <Card className="w-full p-5 flex flex-col gap-3 border border-ih-border">
            <div className="flex justify-between">
              <span className="text-ih-text-secondary">Créditos adicionados</span>
              <span className="font-semibold text-genea-green">
                {photos} {photos === 1 ? "foto" : "fotos"}
              </span>
            </div>
            <div className="flex justify-between border-t border-ih-border pt-3">
              <span className="text-ih-text-secondary">Valor pago</span>
              <span className="font-medium text-ih-text">
                R$ {amount.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </Card>

          {/* CTA */}
          <Link href="/upload" className="w-full">
            <Button onClick={onStartRestoring} size="lg" className="w-full gap-2">
              Começar a restaurar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          {/* Receipt note */}
          <p className="text-sm text-ih-text-muted text-center">
            Mandamos o recibo pro seu email. Seus créditos nunca vencem.
          </p>
        </div>
      </main>
    </div>
  );
}
