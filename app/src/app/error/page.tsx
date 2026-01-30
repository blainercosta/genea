"use client";

import { useRouter } from "next/navigation";
import { GenericError } from "@/components/screens";

export default function ErrorPage() {
  const router = useRouter();

  const handleRetry = () => {
    router.back();
  };

  return <GenericError onRetry={handleRetry} />;
}
