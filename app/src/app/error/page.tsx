"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GenericError } from "@/components/screens";
import { analytics } from "@/lib/analytics";

export default function ErrorPage() {
  const router = useRouter();

  useEffect(() => {
    analytics.errorPageView();
  }, []);

  const handleRetry = () => {
    router.back();
  };

  return <GenericError onRetry={handleRetry} />;
}
