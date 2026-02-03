"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (key && host) {
        posthog.init(key, {
          api_host: host,
          person_profiles: "identified_only",
          // Pageview & navigation tracking
          capture_pageview: true,
          capture_pageleave: true,
          // Autocapture: clicks, inputs, form submissions
          autocapture: true,
          // Session Replay: watch user sessions
          session_recording: {
            maskAllInputs: false,
            maskInputOptions: {
              password: true,
            },
          },
          // Heatmaps: dead clicks & rage clicks
          capture_dead_clicks: true,
        });
      }
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
