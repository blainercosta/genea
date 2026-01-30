"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequestRefund } from "@/components/screens";
import { analytics } from "@/lib/analytics";
import { useUser } from "@/hooks";

function RefundContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  // Valor padrão ou do último pagamento (poderia vir de histórico)
  const refundAmount = Number(searchParams.get("amount")) || 29.9;

  useEffect(() => {
    analytics.refundPageView();
  }, []);

  const handleSubmit = (reason: string, details: string, pixKey: string) => {
    analytics.refundSubmit(reason);
    // TODO: Integrar com API de refund real
    // Passa dados para página de confirmação
    const params = new URLSearchParams({
      amount: refundAmount.toString(),
      pixKey: maskPixKey(pixKey),
    });
    router.push(`/refund-confirmed?${params.toString()}`);
  };

  const handleCancel = () => {
    analytics.refundCancel();
    router.back();
  };

  return <RequestRefund onSubmit={handleSubmit} onCancel={handleCancel} />;
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
