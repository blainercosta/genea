"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Result } from "@/components/screens";
import { useUser } from "@/hooks";
import { analytics } from "@/lib/analytics";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, getRestoration, isTrial, credits, getLatestRestoration } = useUser();

  const restorationId = searchParams.get("id");
  const originalUrlParam = searchParams.get("original");
  const restoredUrlParam = searchParams.get("restored");

  // Get restoration data
  const [restoration, setRestoration] = useState<{
    originalUrl: string;
    restoredUrl: string;
  } | null>(null);

  useEffect(() => {
    // First try query params (most reliable)
    if (originalUrlParam && restoredUrlParam) {
      setRestoration({
        originalUrl: decodeURIComponent(originalUrlParam),
        restoredUrl: decodeURIComponent(restoredUrlParam),
      });
      analytics.resultView(isTrial());
      return;
    }

    // Wait for user data to load
    if (isLoading) return;

    // Try to get restoration from localStorage
    const data = restorationId
      ? getRestoration(restorationId)
      : getLatestRestoration();

    if (data && data.restoredUrl) {
      setRestoration({
        originalUrl: data.originalUrl,
        restoredUrl: data.restoredUrl,
      });
    }

    // Track result view
    analytics.resultView(isTrial());
  }, [restorationId, originalUrlParam, restoredUrlParam, getRestoration, getLatestRestoration, isTrial, isLoading]);

  const isPaid = !isTrial();

  const handleDownload = () => {
    if (!restoration?.restoredUrl) return;

    // Track download
    analytics.downloadClick(isTrial());

    // Use proxy API to download (avoids CORS issues with S3)
    const downloadUrl = `/api/download?url=${encodeURIComponent(restoration.restoredUrl)}`;

    // Create download link
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `genea-restored-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRequestAdjustment = () => {
    const params = new URLSearchParams();
    if (restorationId) params.set("id", restorationId);
    if (restoration?.restoredUrl) params.set("restored", encodeURIComponent(restoration.restoredUrl));
    router.push(`/adjust?${params.toString()}`);
  };

  const handleShare = async () => {
    if (!restoration?.restoredUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Minha foto restaurada no Genea",
          text: "Olha como ficou minha foto antiga depois de restaurar no Genea!",
          url: restoration.restoredUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(restoration.restoredUrl);
    }
  };

  const handleUpgrade = () => {
    router.push("/checkout");
  };

  return (
    <Result
      originalUrl={restoration?.originalUrl}
      restoredUrl={restoration?.restoredUrl}
      isPaid={isPaid}
      credits={credits}
      onDownload={handleDownload}
      onRequestAdjustment={handleRequestAdjustment}
      onShare={handleShare}
      onUpgrade={handleUpgrade}
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
