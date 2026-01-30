// User state stored in localStorage
export interface User {
  email: string;
  credits: number;
  isTrialUsed: boolean;
  restorations: Restoration[];
}

// Photo restoration record
export interface Restoration {
  id: string;
  originalUrl: string;
  restoredUrl: string;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  adjustments: Adjustment[];
}

// Adjustment request for a restoration
export interface Adjustment {
  id: string;
  instructions: string;
  resultUrl: string;
  createdAt: string;
}

// Payment record
export interface Payment {
  id: string;
  email: string;
  amount: number;
  credits: number;
  method: "pix" | "card";
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

// Pricing plans
export interface PricingPlan {
  id: string;
  name: string;
  photos: number;
  price: number;
  unitPrice: string | null;
  benefits: string[];
  popular?: boolean;
}

// API Response types
export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface RestoreResponse {
  success: boolean;
  restorationId?: string;
  status?: "processing" | "completed" | "failed";
  restoredUrl?: string;
  error?: string;
}

export interface RestoreStatusResponse {
  success: boolean;
  status: "processing" | "completed" | "failed";
  restoredUrl?: string;
  error?: string;
}

// fal.ai response
export interface FalRestoreResponse {
  image: {
    url: string;
    content_type: string;
    file_name?: string;
    file_size?: number;
    width: number;
    height: number;
  };
}

// PostHog event types
export type AnalyticsEvent =
  | "landing_view"
  | "cta_click"
  | "email_submit"
  | "upload_start"
  | "upload_complete"
  | "processing_start"
  | "processing_complete"
  | "result_view"
  | "download_click"
  | "checkout_view"
  | "plan_select"
  | "payment_method"
  | "payment_start"
  | "payment_complete"
  | "payment_failed"
  | "adjustment_request"
  | "refund_request";
