"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Processing } from "@/components/screens";
import { useUser, useRestore } from "@/hooks";
import { analytics } from "@/lib/analytics";

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateRestoration } = useUser();
  const startTimeRef = useRef<number>(Date.now());
  const hasStartedRef = useRef(false); // Prevent duplicate calls

  const restorationId = searchParams.get("id");
  const imageUrl = searchParams.get("url");

  const { restore, status, restoredUrl, error } = useRestore({
    onComplete: (url) => {
      // Calculate duration
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      analytics.processingComplete(durationSeconds);

      // Update restoration record
      if (restorationId) {
        updateRestoration(restorationId, {
          status: "completed",
          restoredUrl: url,
        });
      }

      // Navigate to result with URLs as fallback
      const originalUrl = imageUrl ? decodeURIComponent(imageUrl) : "";
      router.push(`/result?id=${restorationId}&original=${encodeURIComponent(originalUrl)}&restored=${encodeURIComponent(url)}`);
    },
    onError: (err) => {
      console.error("Restore error:", err);

      // Update restoration record
      if (restorationId) {
        updateRestoration(restorationId, {
          status: "failed",
        });
      }

      // Navigate to error page
      router.push("/error");
    },
  });

  // Start restoration when component mounts (only once)
  useEffect(() => {
    if (imageUrl && status === "idle" && !hasStartedRef.current) {
      hasStartedRef.current = true;
      analytics.processingStart();
      restore(decodeURIComponent(imageUrl));
    }
  }, [imageUrl, status, restore]);

  // Get preview URL from search params
  const previewUrl = imageUrl ? decodeURIComponent(imageUrl) : undefined;

  return <Processing previewUrl={previewUrl} />;
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<Processing />}>
      <ProcessingContent />
    </Suspense>
  );
}
