"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Header } from "@/components/layout";
import { Button, Input, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

interface EmailCaptureProps {
  onSubmit?: (email: string) => void;
}

export function EmailCapture({ onSubmit }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && acceptedTerms && onSubmit) {
      onSubmit(email);
    }
  };

  const isValidEmail = email.includes("@") && email.includes(".");
  const canSubmit = isValidEmail && acceptedTerms;

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 md:p-10 flex flex-col items-center gap-8 shadow-card rounded-[20px]">
          {/* Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-genea-amber/10 flex items-center justify-center">
            <Mail className="w-10 h-10 md:w-12 md:h-12 text-genea-amber" />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-ih-text">
              Pra onde enviamos sua foto restaurada?
            </h1>
            <p className="text-ih-text-secondary">
              A gente manda o resultado direto no seu email.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-ih-border text-genea-green focus:ring-genea-green cursor-pointer"
              />
              <span className="text-sm text-ih-text-secondary">
                Li e aceito os{" "}
                <a href="/termos" className="text-genea-green hover:underline">
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a href="/privacidade" className="text-genea-green hover:underline">
                  Política de Privacidade
                </a>
              </span>
            </label>

            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit}
              className="w-full"
            >
              Continuar
            </Button>
          </form>

          {/* Spam note */}
          <p className="text-sm text-ih-text-muted text-center">
            Prometemos não enviar spam.
          </p>
        </Card>
      </main>
    </div>
  );
}
