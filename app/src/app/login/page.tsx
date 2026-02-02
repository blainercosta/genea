"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LoginCapture } from "@/components/screens";
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

function LoginContent() {
  const router = useRouter();
  const { initialize, user, isLoading } = useUser();

  useEffect(() => {
    analytics.loginView();
  }, []);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (!isLoading && user?.email) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  const handleSubmit = async (email: string) => {
    // Initialize user and sync from Supabase
    const { user: syncedUser } = await initialize(email);
    identify(email);
    analytics.emailSubmit(email);

    // Always redirect to dashboard after login
    // If user has no history, dashboard will show empty state or redirect
    const hasHistory = syncedUser.restorations && syncedUser.restorations.length > 0;
    if (hasHistory) {
      router.push("/dashboard");
    } else {
      // User exists but no history - go to upload to create first restoration
      router.push("/upload");
    }
  };

  // Show loading while checking if already logged in
  if (isLoading) {
    return <LoadingScreen />;
  }

  return <LoginCapture onSubmit={handleSubmit} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LoginContent />
    </Suspense>
  );
}
