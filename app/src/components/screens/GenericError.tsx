"use client";

import { AlertTriangle, RefreshCcw, MessageCircle } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { Header } from "@/components/layout";
import Link from "next/link";

interface GenericErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function GenericError({
  title = "Ops, algo deu errado",
  message = "Tivemos um probleminha ao processar sua solicitação. Mas calma, dá pra resolver.",
  onRetry,
  showRetry = true,
}: GenericErrorProps) {
  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="flex flex-col items-center gap-6 max-w-md w-full p-8 md:p-10 border border-ih-border">
          {/* Error icon */}
          <div className="w-20 h-20 rounded-full bg-ih-negative/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-ih-negative" />
          </div>

          {/* Title */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl font-bold text-ih-text">{title}</h1>
            <p className="text-ih-text-secondary">{message}</p>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-3">
            {showRetry && (
              <Button onClick={onRetry} className="w-full gap-2" size="lg">
                <RefreshCcw className="w-4 h-4" />
                Tentar novamente
              </Button>
            )}

            <Link href="/" className="w-full">
              <Button variant="secondary" className="w-full">
                Voltar pro início
              </Button>
            </Link>
          </div>

          {/* Support link */}
          <div className="flex items-center gap-2 text-sm text-ih-text-muted">
            <MessageCircle className="w-4 h-4" />
            <span>
              Problema continua?{" "}
              <a
                href="mailto:contato@genea.cc"
                className="text-genea-green hover:underline font-medium"
              >
                Fale com a gente
              </a>
            </span>
          </div>
        </Card>
      </main>
    </div>
  );
}
