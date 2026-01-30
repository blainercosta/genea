"use client";

import { CheckCircle, Clock } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { Header } from "@/components/layout";
import Link from "next/link";

interface RefundConfirmationProps {
  amount?: number;
  pixKey?: string;
}

export function RefundConfirmation({
  amount = 29.9,
  pixKey = "***@email.com",
}: RefundConfirmationProps) {
  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-8 max-w-md w-full">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-genea-green flex items-center justify-center shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl font-bold text-ih-text">
              Reembolso solicitado
            </h1>
            <p className="text-ih-text-secondary">
              Seu pedido foi recebido. A gente vai processar rapidinho.
            </p>
          </div>

          {/* Summary card */}
          <Card className="w-full p-5 flex flex-col gap-4 border border-ih-border">
            <div className="flex justify-between items-center">
              <span className="text-ih-text-secondary">Valor a receber</span>
              <span className="font-semibold text-genea-green text-lg">
                R$ {amount.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="border-t border-ih-border pt-3 flex justify-between">
              <span className="text-ih-text-secondary">Chave PIX</span>
              <span className="font-medium text-ih-text">{pixKey}</span>
            </div>
            <div className="bg-genea-amber/10 rounded-lg p-3 flex items-center gap-3">
              <Clock className="w-5 h-5 text-genea-amber flex-shrink-0" />
              <p className="text-sm text-ih-text">
                O dinheiro cai na sua conta em até <span className="font-medium">24 horas úteis</span>.
              </p>
            </div>
          </Card>

          {/* CTA */}
          <Link href="/" className="w-full">
            <Button className="w-full" size="lg">Voltar pro início</Button>
          </Link>

          {/* Contact note */}
          <p className="text-sm text-ih-text-muted text-center">
            Qualquer dúvida, fale com a gente em{" "}
            <a href="mailto:contato@genea.com.br" className="text-genea-green hover:underline">
              contato@genea.com.br
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
