"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks";

/**
 * Client-side auth redirect component.
 * This runs after hydration and redirects logged-in users.
 * Does not affect SSR - landing page content is always rendered server-side for SEO.
 */
export function AuthRedirect() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;

    // Redirect logged-in users based on their history
    if (user?.email) {
      const hasHistory = user.restorations && user.restorations.length > 0;
      router.replace(hasHistory ? "/dashboard" : "/upload");
    }
  }, [user, isLoading, router]);

  // This component renders nothing - just handles redirect logic
  return null;
}
