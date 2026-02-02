"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { EmailCapture } from "@/components/screens";
import { Header } from "@/components/layout";
import { useUser } from "@/hooks";
import { analytics, identify } from "@/lib/analytics";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-genea-green animate-spin" />
      </main>
    </div>
  );
}

function StartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initialize } = useUser();

  const planId = searchParams.get("plan");
  const restorationId = searchParams.get("restoration");

  useEffect(() => {
    analytics.startPageView();
  }, []);

  const handleSubmit = async (email: string) => {
    // Initialize user and sync from Supabase (to get existing credits)
    const { isNewUser, user } = await initialize(email);
    identify(email);
    analytics.emailSubmit(email);

    // Send welcome email only on first access (new user)
    if (isNewUser) {
      fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, type: "welcome" }),
      }).catch(() => {
        // Ignore email errors - not critical
      });
    }

    // If plan is specified, go to customer info to collect data for PIX
    if (planId) {
      const params = new URLSearchParams({ plan: planId });
      if (restorationId) params.set("restoration", restorationId);
      router.push(`/customer-info?${params.toString()}`);
      return;
    }

    // Returning user with history: go to dashboard
    const hasHistory = !isNewUser && user.restorations && user.restorations.length > 0;
    if (hasHistory) {
      router.push("/dashboard");
      return;
    }

    // New user or user without history: go to upload
    router.push("/upload");
  };

  return <EmailCapture onSubmit={handleSubmit} />;
}

export default function StartPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <StartContent />
    </Suspense>
  );
}
