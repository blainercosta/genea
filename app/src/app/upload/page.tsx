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

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if this is paid flow (has credits) or trial
  const isPaid = mounted ? !isTrial() : false;
  const displayCredits = mounted ? credits : 0;

  const { upload, isUploading, error } = useUpload({
    onSuccess: (url) => {
      // Create restoration record
      const restorationId = `r_${Date.now()}`;
      createRestoration({
        id: restorationId,
        originalUrl: url,
        restoredUrl: "",
        status: "processing",
        createdAt: new Date().toISOString(),
        adjustments: [],
      });

      // Use a credit (or trial)
      consumeCredit();

      // Track analytics
      analytics.uploadComplete(0);

      // Navigate to processing with restoration ID
      router.push(`/processing?id=${restorationId}&url=${encodeURIComponent(url)}`);
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const handleUpload = async (file: File) => {
    // Check if user can restore (has trial or credits)
    if (!canRestore()) {
      router.push("/checkout");
      return;
    }

    // Track upload start
    analytics.uploadStart("gallery");

    // Upload file
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
