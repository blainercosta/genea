import posthog from "posthog-js";

type EventProperties = Record<string, unknown>;

/**
 * Track an analytics event using PostHog
 */
export function track(event: string, properties?: EventProperties) {
  if (typeof window !== "undefined") {
    posthog.capture(event, properties);
  }
}

/**
 * Identify a user
 */
export function identify(email: string, properties?: EventProperties) {
  if (typeof window !== "undefined") {
    posthog.identify(email, properties);
  }
}

/**
 * Reset user identification (on logout)
 */
export function reset() {
  if (typeof window !== "undefined") {
    posthog.reset();
  }
}

/**
 * Analytics helper with typed events for the entire funnel
 */
export const analytics = {
  // ============================================
  // LANDING PAGE
  // ============================================
  landingView: (properties?: { utm_source?: string; utm_medium?: string; utm_campaign?: string }) =>
    track("landing_view", properties),

  ctaClick: (position: "hero" | "pricing" | "final" | "mobile_sticky" | "navbar") =>
    track("cta_click", { position }),

  scrollToResults: () => track("scroll_to_results"),

  faqExpand: (question: string) => track("faq_expand", { question }),

  // ============================================
  // EMAIL CAPTURE / START
  // ============================================
  startPageView: () => track("start_page_view"),

  emailSubmit: (email: string) => track("email_submit", { email_domain: email.split("@")[1] }),

  // ============================================
  // UPLOAD FLOW
  // ============================================
  uploadPageView: (isPaid: boolean) => track("upload_page_view", { is_paid: isPaid }),

  uploadStart: (method: "gallery" | "camera" | "drag") => track("upload_start", { method }),

  uploadComplete: (fileSize: number, fileType: string) =>
    track("upload_complete", { file_size_kb: Math.round(fileSize / 1024), file_type: fileType }),

  uploadError: (error: string) => track("upload_error", { error }),

  // ============================================
  // PROCESSING
  // ============================================
  processingStart: () => track("processing_start"),

  processingComplete: (durationSeconds: number) =>
    track("processing_complete", { duration_seconds: durationSeconds }),

  processingError: (error: string) => track("processing_error", { error }),

  // ============================================
  // RESULT PAGE
  // ============================================
  resultView: (isPaid: boolean) => track("result_view", { is_paid: isPaid }),

  downloadClick: (isPaid: boolean) => track("download_click", { is_paid: isPaid }),

  shareClick: (method: "native" | "clipboard") => track("share_click", { method }),

  upgradeClick: (fromPage: string) => track("upgrade_click", { from_page: fromPage }),

  requestAdjustmentClick: () => track("request_adjustment_click"),

  // ============================================
  // CHECKOUT / PAYMENT
  // ============================================
  checkoutView: (source: string) => track("checkout_view", { source }),

  planSelect: (planId: string, planName: string, price: number, photos: number) =>
    track("plan_select", { plan_id: planId, plan_name: planName, price, photos }),

  paymentMethodSelect: (method: "pix" | "card") => track("payment_method_select", { method }),

  paymentStart: (planId: string, amount: number, method: "pix" | "card") =>
    track("payment_start", { plan_id: planId, amount, method }),

  paymentComplete: (planId: string, amount: number, method: "pix" | "card") =>
    track("payment_complete", { plan_id: planId, amount, method }),

  paymentFailed: (error: string, planId: string) =>
    track("payment_failed", { error, plan_id: planId }),

  paymentConfirmationView: (photos: number, amount: number) =>
    track("payment_confirmation_view", { photos, amount }),

  // ============================================
  // ADJUSTMENTS
  // ============================================
  adjustPageView: () => track("adjust_page_view"),

  adjustmentSelect: (adjustments: string[]) =>
    track("adjustment_select", { adjustments, count: adjustments.length }),

  adjustmentSubmit: (adjustments: string[], hasCustomNote: boolean) =>
    track("adjustment_submit", { adjustments, count: adjustments.length, has_custom_note: hasCustomNote }),

  adjustmentCancel: () => track("adjustment_cancel"),

  adjustmentResultView: () => track("adjustment_result_view"),

  adjustmentApprove: () => track("adjustment_approve"),

  adjustmentReject: () => track("adjustment_reject"),

  // ============================================
  // REFUND
  // ============================================
  refundPageView: () => track("refund_page_view"),

  refundSubmit: (reason: string) => track("refund_submit", { reason }),

  refundCancel: () => track("refund_cancel"),

  refundConfirmationView: () => track("refund_confirmation_view"),

  // ============================================
  // DASHBOARD
  // ============================================
  dashboardView: (restorationCount: number, credits: number) =>
    track("dashboard_view", { restoration_count: restorationCount, credits }),

  // ============================================
  // LOGIN
  // ============================================
  loginView: () => track("login_view"),

  // ============================================
  // ERRORS
  // ============================================
  errorPageView: (errorType?: string) => track("error_page_view", { error_type: errorType }),
};
