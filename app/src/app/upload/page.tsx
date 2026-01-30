"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "@/components/screens";
import { useUser, useUpload } from "@/hooks";
import { analytics } from "@/lib/analytics";

export default function UploadPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, isTrial, credits, consumeCredit, canRestore, createRestoration } = useUser();

  // Check if this is paid flow (has credits) or trial
  const isPaid = mounted ? !isTrial() : false;
  const displayCredits = mounted ? credits : 0;

  // Wait for client-side hydration and track page view
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      analytics.uploadPageView(isPaid);
    }
  }, [mounted, isPaid]);

  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const { upload, isUploading, error } = useUpload({
    onSuccess: (url) => {
      const restorationId = `r_${Date.now()}`;
      createRestoration({
        id: restorationId,
        originalUrl: url,
        restoredUrl: "",
        status: "processing",
        createdAt: new Date().toISOString(),
        adjustments: [],
      });

      consumeCredit();
      analytics.uploadComplete(currentFile?.size || 0, currentFile?.type || "unknown");
      router.push(`/processing?id=${restorationId}&url=${encodeURIComponent(url)}`);
    },
    onError: (err) => {
      analytics.uploadError(typeof err === "string" ? err : "Unknown error");
      console.error("Upload error:", err);
    },
  });

  const handleUpload = async (file: File) => {
    if (!canRestore()) {
      analytics.upgradeClick("upload");
      router.push("/checkout");
      return;
    }

    setCurrentFile(file);
    analytics.uploadStart("gallery");
    await upload(file);
  };

  return (
    <PhotoUpload
      onUpload={handleUpload}
      isPaid={isPaid}
      credits={displayCredits}
    />
  );
}
