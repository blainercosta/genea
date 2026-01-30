import { NextRequest, NextResponse } from "next/server";
import {
  isResendConfigured,
  sendWelcomeEmail,
  sendRestorationCompleteEmail,
  sendPaymentConfirmedEmail,
  sendRefundProcessedEmail,
} from "@/lib/resend";

/**
 * POST /api/email
 * Send transactional emails via Resend
 *
 * Request body:
 * - to: Email recipient
 * - type: Email template type
 * - data: Template-specific data
 */

interface WelcomeRequest {
  to: string;
  type: "welcome";
  data?: { name?: string };
}

interface RestorationCompleteRequest {
  to: string;
  type: "restoration_complete";
  data: { restorationUrl: string; name?: string };
}

interface PaymentConfirmedRequest {
  to: string;
  type: "payment_confirmed";
  data: { planName: string; credits: number; amount: number; name?: string };
}

interface RefundProcessedRequest {
  to: string;
  type: "refund_processed";
  data: { amount: number; name?: string };
}

type EmailRequest =
  | WelcomeRequest
  | RestorationCompleteRequest
  | PaymentConfirmedRequest
  | RefundProcessedRequest;

export async function POST(request: NextRequest) {
  try {
    if (!isResendConfigured()) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const body = (await request.json()) as EmailRequest;
    const { to, type, data } = body;

    if (!to || !type) {
      return NextResponse.json(
        { error: "to and type are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    let result;

    switch (type) {
      case "welcome":
        result = await sendWelcomeEmail(to, data?.name);
        break;

      case "restoration_complete":
        if (!data?.restorationUrl) {
          return NextResponse.json(
            { error: "restorationUrl is required for restoration_complete" },
            { status: 400 }
          );
        }
        result = await sendRestorationCompleteEmail(
          to,
          data.restorationUrl,
          data.name
        );
        break;

      case "payment_confirmed":
        if (!data?.planName || data?.credits === undefined || data?.amount === undefined) {
          return NextResponse.json(
            { error: "planName, credits, and amount are required for payment_confirmed" },
            { status: 400 }
          );
        }
        result = await sendPaymentConfirmedEmail(
          to,
          data.planName,
          data.credits,
          data.amount,
          data.name
        );
        break;

      case "refund_processed":
        if (data?.amount === undefined) {
          return NextResponse.json(
            { error: "amount is required for refund_processed" },
            { status: 400 }
          );
        }
        result = await sendRefundProcessedEmail(to, data.amount, data.name);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      type,
      to,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
