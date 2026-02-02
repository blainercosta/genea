"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/screens";
import { useUser } from "@/hooks";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Wait for user data to load
    if (isLoading) return;

    // If user is logged in, redirect based on history
    if (user?.email) {
      const hasHistory = user.restorations && user.restorations.length > 0;
      if (hasHistory) {
        setShouldRedirect(true);
        router.replace("/dashboard");
      } else {
        setShouldRedirect(true);
        router.replace("/upload");
      }
    }
  }, [user, isLoading, router]);

  // Show nothing while redirecting to prevent flash
  if (shouldRedirect) {
    return null;
  }

  return <LandingPage />;
}
