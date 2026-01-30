"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequestAdjustment } from "@/components/screens";
import { useUser } from "@/hooks";
import { analytics } from "@/lib/analytics";

function AdjustContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getRestoration, getLatestRestoration, credits } = useUser();

  const restorationId = searchParams.get("id");
  const restoredUrlParam = searchParams.get("restored");

  const [restoredUrl, setRestoredUrl] = useState<string | undefined>();

  useEffect(() => {
    analytics.adjustPageView();

    if (restoredUrlParam) {
      setRestoredUrl(decodeURIComponent(restoredUrlParam));
      return;
    }

    const data = restorationId
      ? getRestoration(restorationId)
      : getLatestRestoration();

    if (data?.restoredUrl) {
      setRestoredUrl(data.restoredUrl);
    }
  }, [restorationId, restoredUrlParam, getRestoration, getLatestRestoration]);

  const handleSubmit = (adjustments: string[], customNote: string) => {
    analytics.adjustmentSubmit(adjustments, customNote.length > 0);

    if (!restoredUrl) {
      console.error("No restored URL to adjust");
      return;
    }

    // Build URL params for processing page
    const params = new URLSearchParams();
    params.set("mode", "adjust");
    params.set("url", encodeURIComponent(restoredUrl));
    params.set("adjustments", JSON.stringify(adjustments));
    if (customNote) {
      params.set("note", encodeURIComponent(customNote));
    }
    if (restorationId) {
      params.set("id", restorationId);
    }

    router.push(`/processing?${params.toString()}`);
  };

  const handleCancel = () => {
    analytics.adjustmentCancel();
    if (restorationId) {
      router.push(`/result?id=${restorationId}`);
    } else {
      router.push("/result");
    }
  };

  return (
    <RequestAdjustment
      photoUrl={restoredUrl}
      credits={credits}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

export default function AdjustPage() {
  return (
    <Suspense fallback={<RequestAdjustment />}>
      <AdjustContent />
    </Suspense>
  );
}
