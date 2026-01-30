"use client";

import { useRouter } from "next/navigation";
import { EmailCapture } from "@/components/screens";
import { useUser } from "@/hooks";
import { analytics, identify } from "@/lib/analytics";

export default function StartPage() {
  const router = useRouter();
  const { initialize } = useUser();

  const handleSubmit = (email: string) => {
    // Initialize user with email
    initialize(email);

    // Identify user for analytics
    identify(email);
    analytics.emailSubmit();

    // Proceed to upload
    router.push("/upload");
  };

  return <EmailCapture onSubmit={handleSubmit} />;
}
