"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PixPayment } from "@/components/screens";
import { Header } from "@/components/layout";
import { analytics, track } from "@/lib/analytics";
import { useUser } from "@/hooks";
import { getUser } from "@/lib/storage";

interface PixData {
  id: string;
  qrCode: string;
  qrCodeBase64: string;
  copyPaste: string;
  expiresAt: string;
  amount: number;
}

interface PlanData {
  id: string;
  name: string;
  photos: number;
  price: number;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-genea-green animate-spin" />
        <p className="text-ih-text-secondary">Gerando PIX...</p>
      </main>
    </div>
  );
}

function PixContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addCredits, syncCredits } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [planData, setPlanData] = useState<PlanData | null>(null);

  const planId = searchParams.get("plan") || "2";

  useEffect(() => {
    const user = getUser();

    // Check if user has email
    if (!user?.email) {
      router.push(`/start?plan=${planId}`);
      return;
    }

    // Check if user has customer info for PIX
    if (!user.name || !user.phone || !user.taxId) {
      router.push(`/customer-info?plan=${planId}`);
      return;
    }

    const generatePix = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/payment/pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId,
            email: user.email,
            name: user.name,
            phone: user.phone,
            taxId: user.taxId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao gerar PIX");
        }

        setPixData(data.pix);
        setPlanData(data.plan);

        analytics.paymentStart(planId, data.plan.price, "pix");
      } catch (err) {
        console.error("Erro ao gerar PIX:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    generatePix();
  }, [planId, router]);

  // Payment confirmed via polling (API checked status with Abacate Pay)
  // This is called when API returns COMPLETED status from Abacate Pay
  const handlePaymentConfirmed = async () => {
    if (!planData || !pixData) return;

    // Double-check: Verify payment status one more time before adding credits
    try {
      const response = await fetch(`/api/payment/pix?id=${pixData.id}`);
      const data = await response.json();

      // Only add credits if status is truly COMPLETED
      if (data.status !== "COMPLETED") {
        console.error("Payment status mismatch:", data.status);
        setError("Status de pagamento não confirmado. Aguarde ou entre em contato.");
        return;
      }

      // Validate amount matches plan (prevent manipulation)
      if (data.amount !== planData.price) {
        console.error("Amount mismatch:", data.amount, "vs", planData.price);
        setError("Valor do pagamento não confere. Entre em contato com suporte.");
        return;
      }

      // All validations passed - sync credits from Supabase (webhook already added them)
      analytics.paymentComplete(planData.id, planData.price, "pix");

      // Sync credits from Supabase (webhook should have added them)
      // This ensures localStorage is updated with the credits from the database
      await syncCredits();

      // Also add locally as fallback (in case webhook hasn't processed yet)
      addCredits(planData.photos);

      // Store payment record in localStorage for audit trail
      const user = getUser();
      if (user) {
        const payments = JSON.parse(localStorage.getItem("genea_payments") || "[]");
        payments.push({
          pixId: pixData.id,
          planId: planData.id,
          photos: planData.photos,
          amount: planData.price,
          email: user.email,
          confirmedAt: new Date().toISOString(),
        });
        localStorage.setItem("genea_payments", JSON.stringify(payments));
      }

      const params = new URLSearchParams({
        photos: planData.photos.toString(),
        amount: planData.price.toString(),
        plan: planData.name,
      });
      router.push(`/payment-confirmed?${params.toString()}`);
    } catch (err) {
      console.error("Error verifying payment:", err);
      setError("Erro ao verificar pagamento. Tente novamente.");
    }
  };

  const handleExpired = () => {
    track("pix_expired", { planId });
  };

  const handleCancel = () => {
    router.push(`/checkout?plan=${planId}`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ih-bg flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-ih-text">
              Erro ao gerar PIX
            </h1>
            <p className="text-ih-text-secondary">{error}</p>
          </div>
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-genea-green text-white rounded-xl font-medium"
          >
            Tentar novamente
          </button>
        </main>
      </div>
    );
  }

  if (!pixData || !planData) {
    return null;
  }

  return (
    <PixPayment
      pix={pixData}
      plan={planData}
      onPaymentConfirmed={handlePaymentConfirmed}
      onExpired={handleExpired}
      onCancel={handleCancel}
    />
  );
}

export default function PixPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PixContent />
    </Suspense>
  );
}
