"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmailCapture } from "@/components/screens";
import { useUser } from "@/hooks";
import { analytics, identify } from "@/lib/analytics";

export default function StartPage() {
  const router = useRouter();
  const { initialize } = useUser();

  useEffect(() => {
    analytics.startPageView();
  }, []);

  const handleSubmit = (email: string) => {
    initialize(email);
    identify(email);
    analytics.emailSubmit(email);
    router.push("/upload");
  };

  return <EmailCapture onSubmit={handleSubmit} />;
}
