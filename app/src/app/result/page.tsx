"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Result } from "@/components/screens";
import { useUser } from "@/hooks";
import { analytics } from "@/lib/analytics";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, getRestoration, credits, getLatestRestoration } = useUser();
  const autoDownloadTriggeredRef = useRef(false);

  const restorationId = searchParams.get("id");
  const originalUrlParam = searchParams.get("original");
  const restoredUrlParam = searchParams.get("restored");
  const autoDownload = searchParams.get("autoDownload") === "true";

  // Get restoration data (including isTrial flag for watermark)
  const [restoration, setRestoration] = useState<{
    originalUrl: string;
    restoredUrl: string;
    isTrial?: boolean;
  } | null>(null);

  useEffect(() => {
    // Wait for user data to load
    if (isLoading) return;

    // Try to get restoration from localStorage first (has isTrial flag)
    const data = restorationId
      ? getRestoration(restorationId)
      : getLatestRestoration();

    if (data && data.restoredUrl) {
      setRestoration({
        originalUrl: data.originalUrl,
        restoredUrl: data.restoredUrl,
        isTrial: data.isTrial,
      });
      analytics.resultView(data.isTrial ?? false);
      return;
    }

    // Fallback to query params (for direct links)
    if (originalUrlParam && restoredUrlParam) {
      setRestoration({
        originalUrl: decodeURIComponent(originalUrlParam),
        restoredUrl: decodeURIComponent(restoredUrlParam),
        // Assume trial if no restoration record found
        isTrial: true,
      });
      analytics.resultView(true);
    }
  }, [restorationId, originalUrlParam, restoredUrlParam, getRestoration, getLatestRestoration, isLoading]);

  // Use restoration's isTrial flag (captured at upload time, before consumeCredit)
  const isTrialRestoration = restoration?.isTrial ?? true;
  const isPaid = !isTrialRestoration;

  // Auto-download when coming from payment confirmation
  useEffect(() => {
    if (!autoDownload || autoDownloadTriggeredRef.current) return;
    if (!restoration?.restoredUrl || !isPaid) return;

    autoDownloadTriggeredRef.current = true;

    // Small delay to ensure UI is rendered first
    const timer = setTimeout(() => {
      analytics.downloadClick(false);

      // Download without watermark (paid)
      const downloadUrl = `/api/download?url=${encodeURIComponent(restoration.restoredUrl)}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `genea-restored-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);

    return () => clearTimeout(timer);
  }, [autoDownload, restoration?.restoredUrl, isPaid]);

  const handleDownload = () => {
    if (!restoration?.restoredUrl) return;

    // Track download
    analytics.downloadClick(isTrialRestoration);

    // Use proxy API to download (avoids CORS issues with S3)
    // Add trial param to apply watermark for trial users
    const downloadUrl = `/api/download?url=${encodeURIComponent(restoration.restoredUrl)}${isTrialRestoration ? "&trial=true" : ""}`;

    // Create download link
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `genea-restored-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRequestAdjustment = () => {
    analytics.requestAdjustmentClick();
    const params = new URLSearchParams();
    if (restorationId) params.set("id", restorationId);
    if (restoration?.restoredUrl) params.set("restored", encodeURIComponent(restoration.restoredUrl));
    router.push(`/adjust?${params.toString()}`);
  };

  const handleShare = async () => {
    if (!restoration?.restoredUrl) return;

    if (navigator.share) {
      try {
        analytics.shareClick("native");
        await navigator.share({
          title: "Minha foto restaurada no Genea",
          text: "Olha como ficou minha foto antiga depois de restaurar no Genea!",
          url: restoration.restoredUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      analytics.shareClick("clipboard");
      navigator.clipboard.writeText(restoration.restoredUrl);
    }
  };

  const handleUpgrade = () => {
    analytics.upgradeClick("result");
    router.push("/checkout?source=result");
  };

  // Unlock just this photo - plan 1 (R$9.90)
  const handleUnlockThisPhoto = () => {
    analytics.upgradeClick("result_unlock_this");
    // Pass restoration ID so we can redirect back after payment
    const params = new URLSearchParams({
      plan: "1",
      source: "result",
      ...(restorationId && { restoration: restorationId }),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  // Get more photos - go to checkout to choose plan
  const handleGetMorePhotos = () => {
    analytics.upgradeClick("result_get_more");
    // Pass restoration ID so we can redirect back after payment
    const params = new URLSearchParams({
      source: "result",
      ...(restorationId && { restoration: restorationId }),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <Result
      originalUrl={restoration?.originalUrl}
      restoredUrl={restoration?.restoredUrl}
      isPaid={isPaid}
      credits={credits}
      restorationId={restorationId || undefined}
      onDownload={handleDownload}
      onRequestAdjustment={handleRequestAdjustment}
      onShare={handleShare}
      onUpgrade={handleUpgrade}
      onUnlockThisPhoto={handleUnlockThisPhoto}
      onGetMorePhotos={handleGetMorePhotos}
    />
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<Result />}>
      <ResultContent />
    </Suspense>
  );
}
