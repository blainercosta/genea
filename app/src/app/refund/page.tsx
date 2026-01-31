"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequestRefund } from "@/components/screens";
import { analytics } from "@/lib/analytics";
import { useUser } from "@/hooks";

interface PaymentRecord {
  pixId: string;
  planId: string;
  photos: number;
  amount: number;
  email: string;
  confirmedAt: string;
}

function RefundContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [lastPayment, setLastPayment] = useState<PaymentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Wait for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get real payment amount from localStorage
  useEffect(() => {
    if (!mounted) return;

    // Check for amount in URL params first (from result page)
    const urlAmount = searchParams.get("amount");
    if (urlAmount) {
      // Amount provided in URL, use it
      return;
    }

    // Otherwise, get from payment history
    try {
      const payments = JSON.parse(localStorage.getItem("genea_payments") || "[]") as PaymentRecord[];
      if (payments.length > 0) {
        // Get most recent payment
        const latest = payments[payments.length - 1];
        setLastPayment(latest);
      } else {
        // No payments found
        setError("Nenhum pagamento encontrado. Você precisa ter feito uma compra para solicitar reembolso.");
      }
    } catch (e) {
      console.error("Error reading payments:", e);
    }

    analytics.refundPageView();
  }, [mounted, searchParams]);

  // Calculate refund amount
  const refundAmount = Number(searchParams.get("amount")) || lastPayment?.amount || 0;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (reason: string, details: string, pixKey: string) => {
    // Validate PIX key format
    const validationError = validatePixKey(pixKey);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (refundAmount <= 0) {
      setError("Valor de reembolso inválido.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    analytics.refundSubmit(reason);

    try {
      // Call real refund API
      const response = await fetch("/api/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: refundAmount,
          pixKey: pixKey.trim(),
          email: user?.email,
          name: user?.email?.split("@")[0], // Use email prefix as name
          paymentId: lastPayment?.pixId,
          reason: `${reason}${details ? ` - ${details}` : ""}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar reembolso");
      }

      // Store refund request in localStorage for audit
      try {
        const refunds = JSON.parse(localStorage.getItem("genea_refunds") || "[]");
        refunds.push({
          refundId: data.refundId,
          paymentId: lastPayment?.pixId,
          amount: refundAmount,
          reason,
          details,
          pixKeyMasked: maskPixKey(pixKey),
          email: user?.email,
          requestedAt: new Date().toISOString(),
          status: data.status,
        });
        localStorage.setItem("genea_refunds", JSON.stringify(refunds));
      } catch (e) {
        console.error("Error saving refund request:", e);
      }

      // Navigate to confirmation page
      const params = new URLSearchParams({
        amount: refundAmount.toString(),
        pixKey: maskPixKey(pixKey),
      });
      router.push(`/refund-confirmed?${params.toString()}`);
    } catch (err) {
      console.error("Refund error:", err);
      setError(err instanceof Error ? err.message : "Erro ao processar reembolso. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    analytics.refundCancel();
    router.back();
  };

  // Show error state if no valid payment to refund
  if (mounted && error && refundAmount <= 0) {
    return (
      <div className="min-h-screen bg-ih-bg flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-ih-text">Não foi possível processar</h1>
          <p className="text-ih-text-secondary">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-genea-green text-white rounded-xl font-medium"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <RequestRefund
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      error={error || undefined}
      isSubmitting={isSubmitting}
    />
  );
}

/**
 * Validates PIX key format
 */
function validatePixKey(key: string): string | null {
  const cleaned = key.trim();

  if (!cleaned) {
    return "Chave PIX é obrigatória";
  }

  // Email validation
  if (cleaned.includes("@")) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleaned)) {
      return "Email inválido";
    }
    return null;
  }

  // CPF validation (11 digits)
  const digitsOnly = cleaned.replace(/\D/g, "");
  if (digitsOnly.length === 11) {
    // Basic CPF validation (check for all same digits)
    if (/^(\d)\1+$/.test(digitsOnly)) {
      return "CPF inválido";
    }
    return null;
  }

  // Phone validation (10-11 digits with DDD)
  if (digitsOnly.length >= 10 && digitsOnly.length <= 11) {
    return null;
  }

  // Random key (32 characters UUID-like)
  if (cleaned.length >= 32 && cleaned.length <= 36) {
    return null;
  }

  return "Formato de chave PIX não reconhecido. Use CPF, email, telefone ou chave aleatória.";
}

/**
 * Mascara a chave PIX para exibição segura
 */
function maskPixKey(key: string): string {
  if (key.includes("@")) {
    // Email: mostra primeiros 3 caracteres e domínio
    const [user, domain] = key.split("@");
    return `${user.slice(0, 3)}***@${domain}`;
  }
  if (key.length === 11) {
    // CPF: mostra primeiros 3 e últimos 2
    return `${key.slice(0, 3)}.***.***-${key.slice(-2)}`;
  }
  if (key.length >= 10) {
    // Telefone: mostra DDD e últimos 4
    return `(${key.slice(0, 2)}) *****-${key.slice(-4)}`;
  }
  // Chave aleatória: mostra primeiros 4 e últimos 4
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export default function RefundPage() {
  return (
    <Suspense fallback={<RequestRefund onSubmit={() => {}} onCancel={() => {}} />}>
      <RefundContent />
    </Suspense>
  );
}
