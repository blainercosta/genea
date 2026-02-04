"use client";

import { useState, useMemo } from "react";
import { Mail, Loader2, Download } from "lucide-react";
import { Button, Input, Modal } from "@/components/ui";
import { TermsContent, PrivacyContent } from "@/components/legal";
import { validateEmail } from "@/lib/validation";

interface EmailGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailVerified: (email: string) => void;
}

export function EmailGateModal({ isOpen, onClose, onEmailVerified }: EmailGateModalProps) {
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate email with comprehensive checks
  const validation = useMemo(() => validateEmail(email), [email]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!validation.isValid || !acceptedTerms) return;

    const normalizedEmail = email.trim().toLowerCase();
    setIsLoading(true);

    // Just capture email and proceed - no code verification needed
    setTimeout(() => {
      setIsLoading(false);
      onEmailVerified(normalizedEmail);
    }, 300);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!touched && e.target.value.length > 0) {
      setTouched(true);
    }
  };

  const handleSuggestionClick = () => {
    if (validation.suggestion) {
      const match = validation.suggestion.match(/(\S+@\S+\.\S+)/);
      if (match) {
        setEmail(match[1]);
      }
    }
  };

  const handleClose = () => {
    setEmail("");
    setTouched(false);
    setAcceptedTerms(false);
    onClose();
  };

  const canSubmitEmail = validation.isValid && acceptedTerms;
  const showEmailError = touched && email.length > 0 && !validation.isValid;

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen && !showTerms && !showPrivacy}
        onClose={handleClose}
        title=""
        className="max-w-sm rounded-lg"
      >
        <div className="flex flex-col items-center gap-5 py-2">
          {/* Icon */}
          <div className="w-12 h-12 rounded-lg bg-genea-amber/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-genea-amber" />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-lg font-semibold text-ih-text">
              Digite seu email
            </h2>
            <p className="text-sm text-ih-text-secondary">
              Para baixar sua amostra com marca d&apos;água
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={handleEmailChange}
                className={showEmailError ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}
                autoFocus
              />
              {showEmailError && validation.error && (
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
                className="mt-0.5 w-4 h-4 rounded border-ih-border text-genea-green focus:ring-genea-green cursor-pointer"
              />
              <span className="text-xs text-ih-text-secondary">
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
                  Politica de Privacidade
                </button>
              </span>
            </label>

            <Button
              type="submit"
              size="lg"
              disabled={!canSubmitEmail || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Preparando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar amostra
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-ih-text-muted text-center">
            Prometemos nao enviar spam.
          </p>
        </div>
      </Modal>

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
        title="Politica de Privacidade"
      >
        <PrivacyContent />
      </Modal>
    </>
  );
}
