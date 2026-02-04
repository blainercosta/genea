"use client";

import { useState, useMemo } from "react";
import { Mail, KeyRound, Loader2, ArrowLeft, Download, X } from "lucide-react";
import { Button, Input, Modal } from "@/components/ui";
import { TermsContent, PrivacyContent } from "@/components/legal";
import { validateEmail } from "@/lib/validation";

interface EmailGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailVerified: (email: string) => void;
}

type Step = "email" | "code";

export function EmailGateModal({ isOpen, onClose, onEmailVerified }: EmailGateModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate email with comprehensive checks
  const validation = useMemo(() => validateEmail(email), [email]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError(null);

    if (!validation.isValid || !acceptedTerms) return;

    const normalizedEmail = email.trim().toLowerCase();
    setIsLoading(true);

    try {
      // Send auth code
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email: normalizedEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar codigo");
      }

      setStep("code");
    } catch (err) {
      console.error("Auth error:", err);
      if (err instanceof Error && err.message.includes("nao configurado")) {
        // If auth service not available, just proceed with email
        onEmailVerified(normalizedEmail);
      } else {
        setError(err instanceof Error ? err.message : "Erro ao enviar codigo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 8) {
      setError("Digite o codigo de 8 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: email.trim().toLowerCase(),
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Codigo invalido");
      }

      // Successfully authenticated - notify parent
      onEmailVerified(email.trim().toLowerCase());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao verificar codigo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao reenviar codigo");
      }

      setError(null);
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao reenviar codigo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!touched && e.target.value.length > 0) {
      setTouched(true);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 8);
    setCode(value);
  };

  const handleSuggestionClick = () => {
    if (validation.suggestion) {
      const match = validation.suggestion.match(/(\S+@\S+\.\S+)/);
      if (match) {
        setEmail(match[1]);
      }
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setCode("");
    setError(null);
  };

  const handleClose = () => {
    // Reset state when closing
    setStep("email");
    setEmail("");
    setCode("");
    setError(null);
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
      >
        <div className="flex flex-col items-center gap-6 pt-2">
          {step === "code" ? (
            <>
              {/* Back button */}
              <button
                onClick={handleBackToEmail}
                className="self-start flex items-center gap-2 text-ih-text-secondary hover:text-ih-text transition-colors -mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Voltar</span>
              </button>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-genea-green/10 flex items-center justify-center">
                <KeyRound className="w-7 h-7 text-genea-green" />
              </div>

              {/* Text */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-xl font-semibold text-ih-text">
                  Digite o codigo
                </h2>
                <p className="text-sm text-ih-text-secondary">
                  Enviamos um codigo para{" "}
                  <span className="font-medium text-ih-text">{email}</span>
                </p>
              </div>

              {/* Code form */}
              <form onSubmit={handleCodeSubmit} className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    inputMode="text"
                    placeholder="ABCD1234"
                    value={code}
                    onChange={handleCodeChange}
                    className="text-center text-xl tracking-[0.3em] font-mono uppercase"
                    maxLength={8}
                    autoFocus
                    autoCapitalize="characters"
                  />
                  {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={code.length !== 8 || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Verificar e baixar
                    </>
                  )}
                </Button>
              </form>

              {/* Resend */}
              <div className="text-center">
                <p className="text-xs text-ih-text-muted mb-1">
                  Nao recebeu?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-sm text-genea-green hover:underline disabled:opacity-50"
                >
                  Enviar novamente
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-genea-amber/10 flex items-center justify-center">
                <Mail className="w-7 h-7 text-genea-amber" />
              </div>

              {/* Text */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-xl font-semibold text-ih-text">
                  Quase la! Digite seu email
                </h2>
                <p className="text-sm text-ih-text-secondary">
                  Para baixar sua foto em alta qualidade, precisamos do seu email.
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
                  {error && <p className="text-sm text-red-500">{error}</p>}
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
                      Enviando codigo...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Baixar minha foto
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-ih-text-muted text-center">
                Prometemos nao enviar spam.
              </p>
            </>
          )}
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
