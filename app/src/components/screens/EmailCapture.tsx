"use client";

import { useState, useMemo } from "react";
import { Mail } from "lucide-react";
import { Header } from "@/components/layout";
import { Button, Input, Card, Modal } from "@/components/ui";
import { TermsContent, PrivacyContent } from "@/components/legal";
import { validateEmail } from "@/lib/validation";

interface EmailCaptureProps {
  onSubmit?: (email: string) => void;
}

export function EmailCapture({ onSubmit }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [touched, setTouched] = useState(false);

  // Validate email with comprehensive checks
  const validation = useMemo(() => validateEmail(email), [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (validation.isValid && acceptedTerms && onSubmit) {
      onSubmit(email.trim().toLowerCase());
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!touched && e.target.value.length > 0) {
      setTouched(true);
    }
  };

  const handleSuggestionClick = () => {
    if (validation.suggestion) {
      // Extract email from suggestion "Você quis dizer xxx?"
      const match = validation.suggestion.match(/(\S+@\S+\.\S+)/);
      if (match) {
        setEmail(match[1]);
      }
    }
  };

  const canSubmit = validation.isValid && acceptedTerms;
  const showError = touched && email.length > 0 && !validation.isValid;

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 md:p-10 flex flex-col items-center gap-8 shadow-card rounded-[20px]">
          {/* Icon */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-genea-amber/10 flex items-center justify-center">
            <Mail className="w-7 h-7 md:w-8 md:h-8 text-genea-amber" />
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
            <div className="flex flex-col gap-1">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={handleEmailChange}
                className={showError ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}
              />
              {showError && validation.error && (
                <p className="text-sm text-red-500">{validation.error}</p>
              )}
              {validation.suggestion && (
                <button
                  type="button"
                  onClick={handleSuggestionClick}
                  className="text-sm text-genea-green hover:underline text-left"
                >
                  {validation.suggestion}
                </button>
              )}
            </div>

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
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-genea-green hover:underline"
                >
                  Termos de Uso
                </button>{" "}
                e a{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="text-genea-green hover:underline"
                >
                  Política de Privacidade
                </button>
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

      {/* Terms Modal */}
      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Termos de Uso"
      >
        <TermsContent />
      </Modal>

      {/* Privacy Modal */}
      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Política de Privacidade"
      >
        <PrivacyContent />
      </Modal>
    </div>
  );
}
