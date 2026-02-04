"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks";
import { analytics } from "@/lib/analytics";

export default function TryPage() {
  const router = useRouter();
  const { user, isLoading, initAnonymous } = useUser();

  useEffect(() => {
    // Wait for user data to load
    if (isLoading) return;

    // Track page view
    analytics.startPageView();

    // If user already logged in with email, redirect based on state
    if (user?.email) {
      const hasHistory = user.restorations && user.restorations.length > 0;
      if (hasHistory) {
        router.replace("/dashboard");
      } else {
        router.replace("/upload");
      }
      return;
    }

    // Initialize anonymous user for trial and go to upload
    initAnonymous();
    router.replace("/upload");
  }, [user, isLoading, initAnonymous, router]);

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-genea-green animate-spin" />
      <p className="text-ih-text-secondary">Preparando...</p>
    </div>
  );
}
