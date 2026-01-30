"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdjustmentResult } from "@/components/screens";
import { useUser } from "@/hooks";
import { analytics } from "@/lib/analytics";

function AdjustmentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { credits, updateRestoration } = useUser();

  // Lê URLs da query string
  const restorationId = searchParams.get("id");
  const previousUrl = searchParams.get("previous")
    ? decodeURIComponent(searchParams.get("previous")!)
    : undefined;
  const adjustedUrl = searchParams.get("adjusted")
    ? decodeURIComponent(searchParams.get("adjusted")!)
    : undefined;

  useEffect(() => {
    analytics.adjustmentResultView();
  }, []);

  const handleApprove = () => {
    analytics.adjustmentApprove();

    // Atualiza o status da restauração no storage
    if (restorationId && adjustedUrl) {
      updateRestoration(restorationId, {
        restoredUrl: adjustedUrl,
        status: "completed",
      });
    }

    // Navega para resultado final com a foto ajustada
    const params = new URLSearchParams();
    if (restorationId) params.set("id", restorationId);
    if (previousUrl) params.set("original", encodeURIComponent(previousUrl));
    if (adjustedUrl) params.set("restored", encodeURIComponent(adjustedUrl));
    router.push(`/result?${params.toString()}`);
  };

  const handleRequestMore = () => {
    analytics.requestAdjustmentClick();

    // Navega para página de ajuste com a foto atual
    const params = new URLSearchParams();
    if (restorationId) params.set("id", restorationId);
    if (adjustedUrl) params.set("restored", encodeURIComponent(adjustedUrl));
    router.push(`/adjust?${params.toString()}`);
  };

  const handleDownload = () => {
    if (!adjustedUrl) return;

    analytics.downloadClick(false);

    // Usa proxy API para download (evita CORS com S3)
    const downloadUrl = `/api/download?url=${encodeURIComponent(adjustedUrl)}`;

    // Cria link de download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `genea-adjusted-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdjustmentResult
      previousUrl={previousUrl}
      adjustedUrl={adjustedUrl}
      credits={credits}
      onApprove={handleApprove}
      onRequestMore={handleRequestMore}
      onDownload={handleDownload}
    />
  );
}

export default function AdjustmentResultPage() {
  return (
    <Suspense fallback={<AdjustmentResult />}>
      <AdjustmentResultContent />
    </Suspense>
  );
}
