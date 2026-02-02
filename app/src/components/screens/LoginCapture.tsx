"use client";

import { useState, useMemo } from "react";
import { Mail, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout";
import { Button, Input, Card, Modal } from "@/components/ui";
import { TermsContent, PrivacyContent } from "@/components/legal";
import { validateEmail } from "@/lib/validation";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  taxId?: string;
  credits: number;
  isTrialUsed: boolean;
}

interface LoginCaptureProps {
  onSubmit?: (email: string) => void;
  onAuthenticated?: (user: AuthUser) => void;
}

type Step = "email" | "code";

export function LoginCapture({ onSubmit, onAuthenticated }: LoginCaptureProps) {
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
        throw new Error(data.error || "Erro ao enviar código");
      }

      // Proceed to code verification
      setStep("code");
    } catch (err) {
      console.error("Auth error:", err);
      // If auth service not available, fall back to simple email capture
      if (err instanceof Error && err.message.includes("não configurado")) {
        onSubmit?.(normalizedEmail);
      } else {
        setError(err instanceof Error ? err.message : "Erro ao enviar código");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) {
      setError("Digite o código de 6 dígitos");
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
        throw new Error(data.error || "Código inválido");
      }

      // Successfully authenticated
      if (onAuthenticated && data.user) {
        onAuthenticated(data.user);
      } else if (onSubmit) {
        onSubmit(email.trim().toLowerCase());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao verificar código");
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
        throw new Error(data.error || "Erro ao reenviar código");
      }

      setError(null);
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao reenviar código");
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
    // Only allow digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
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

  const canSubmitEmail = validation.isValid && acceptedTerms;
  const showEmailError = touched && email.length > 0 && !validation.isValid;

  // Code verification step
  if (step === "code") {
    return (
      <div className="min-h-screen bg-ih-bg flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md p-8 md:p-10 flex flex-col items-center gap-8 shadow-card rounded-[20px]">
            {/* Back button */}
            <button
              onClick={handleBackToEmail}
              className="self-start flex items-center gap-2 text-ih-text-secondary hover:text-ih-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar</span>
            </button>

            {/* Icon */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-genea-green/10 flex items-center justify-center">
              <KeyRound className="w-7 h-7 md:w-8 md:h-8 text-genea-green" />
            </div>

            {/* Text */}
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="text-2xl md:text-3xl font-semibold text-ih-text">
                Digite o código
              </h1>
              <p className="text-ih-text-secondary">
                Enviamos um código de 6 dígitos para{" "}
                <span className="font-medium text-ih-text">{email}</span>
              </p>
            </div>

            {/* Code form */}
            <form onSubmit={handleCodeSubmit} className="w-full flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={code}
                  onChange={handleCodeChange}
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                  autoFocus
                />
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={code.length !== 6 || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar código"
                )}
              </Button>
            </form>

            {/* Resend */}
            <div className="text-center">
              <p className="text-sm text-ih-text-muted mb-2">
                Não recebeu o código?
              </p>
              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm text-genea-green hover:underline disabled:opacity-50"
              >
                Enviar novamente
              </button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Email capture step - Login specific text
  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 md:p-10 flex flex-col items-center gap-8 shadow-card rounded-[20px]">
          {/* Icon */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-genea-green/10 flex items-center justify-center">
            <Mail className="w-7 h-7 md:w-8 md:h-8 text-genea-green" />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-ih-text">
              Bem-vindo de volta
            </h1>
            <p className="text-ih-text-secondary">
              Digite seu e-mail para ver suas memórias restauradas.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={handleEmailChange}
                className={showEmailError ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}
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
              disabled={!canSubmitEmail || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando código...
                </>
              ) : (
                "Acessar minhas fotos"
              )}
            </Button>
          </form>

          {/* Note */}
          <p className="text-sm text-ih-text-muted text-center">
            Ainda não tem conta?{" "}
            <a href="/start" className="text-genea-green hover:underline">
              Criar conta grátis
            </a>
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
