import type { AnalyticsEvent } from "@/types";

/**
 * Track an analytics event
 * Uses PostHog when available, falls back to console in development
 */
export function track(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>
) {
  // Check if PostHog is available (client-side only)
  if (typeof window !== "undefined" && (window as any).posthog) {
    (window as any).posthog.capture(event, properties);
  } else if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, properties);
  }
}

/**
 * Identify a user
 */
export function identify(email: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && (window as any).posthog) {
    (window as any).posthog.identify(email, properties);
  } else if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] Identify:`, email, properties);
  }
}

/**
 * Reset user identification (on logout)
 */
export function reset() {
  if (typeof window !== "undefined" && (window as any).posthog) {
    (window as any).posthog.reset();
  }
}

// Convenience functions for common events
export const analytics = {
  // Landing page
  landingView: (properties?: { utm_source?: string; utm_medium?: string }) =>
    track("landing_view", properties),

  ctaClick: (position: string) => track("cta_click", { position }),

  // Email capture
  emailSubmit: () => track("email_submit"),

  // Upload flow
  uploadStart: (method: "gallery" | "camera" | "drag") =>
    track("upload_start", { method }),

  uploadComplete: (fileSize: number) =>
    track("upload_complete", { file_size: fileSize }),

  // Processing
  processingStart: () => track("processing_start"),

  processingComplete: (durationSeconds: number) =>
    track("processing_complete", { duration_seconds: durationSeconds }),

  // Result
  resultView: (isTrial: boolean) => track("result_view", { is_trial: isTrial }),

  downloadClick: (isTrial: boolean) =>
    track("download_click", { is_trial: isTrial }),

  // Checkout
  checkoutView: () => track("checkout_view"),

  planSelect: (plan: string, price: number) =>
    track("plan_select", { plan, price }),

  paymentMethod: (method: "pix" | "card") =>
    track("payment_method", { method }),

  paymentStart: (amount: number) => track("payment_start", { amount }),

  paymentComplete: (amount: number, method: "pix" | "card") =>
    track("payment_complete", { amount, method }),

  paymentFailed: (error: string) => track("payment_failed", { error }),

  // Adjustments
  adjustmentRequest: (text: string) =>
    track("adjustment_request", { text }),

  // Refund
  refundRequest: (reason: string) => track("refund_request", { reason }),
};
