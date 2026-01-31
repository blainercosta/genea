import { NextRequest, NextResponse } from "next/server";
import { createWithdrawal, isAbacateConfigured } from "@/lib/abacate";
import { sendRefundProcessedEmail, isResendConfigured } from "@/lib/resend";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import { validatePixKey, isValidEmail } from "@/lib/validation";

/**
 * POST /api/refund
 * Processa uma solicitação de reembolso via PIX
 *
 * Body:
 * - amount: number (valor em reais)
 * - pixKey: string (chave PIX do cliente)
 * - email: string (email do cliente)
 * - name?: string (nome do cliente)
 * - paymentId?: string (ID do pagamento original)
 * - reason?: string (motivo do reembolso)
 */
export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimitResponse = checkRateLimit(request, "refund", RATE_LIMITS.refund);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { amount, pixKey, email, name, paymentId, reason } = body;

    // Validate required fields
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Valor de reembolso inválido" },
        { status: 400 }
      );
    }

    // Validate PIX key format
    const pixValidation = validatePixKey(pixKey || "");
    if (!pixValidation.isValid) {
      return NextResponse.json(
        { error: pixValidation.error || "Chave PIX inválida" },
        { status: 400 }
      );
    }

    // Validate email
    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Check if Abacate Pay is configured
    if (!isAbacateConfigured()) {
      console.error("Abacate Pay não configurado para processar reembolso");
      return NextResponse.json(
        { error: "Sistema de pagamento não configurado" },
        { status: 503 }
      );
    }

    // Generate unique external ID for this refund
    const externalId = `refund_${paymentId || Date.now()}_${Math.random().toString(36).substring(7)}`;

    console.log("Processando reembolso:", {
      externalId,
      amount,
      pixKeyMasked: maskPixKey(pixKey),
      email,
      reason,
    });

    // Create withdrawal (refund) via Abacate Pay
    const withdrawal = await createWithdrawal(
      amount,
      pixKey,
      externalId,
      `Reembolso Genea - ${reason || "Solicitado pelo cliente"}`
    );

    console.log("Reembolso criado:", {
      withdrawalId: withdrawal.id,
      status: withdrawal.status,
      amount: withdrawal.amount,
    });

    // Send confirmation email
    if (isResendConfigured()) {
      try {
        const emailResult = await sendRefundProcessedEmail(email, amount, name);
        if (emailResult.success) {
          console.log("Email de reembolso enviado:", emailResult.id);
        } else {
          console.error("Erro ao enviar email de reembolso:", emailResult.error);
        }
      } catch (emailError) {
        console.error("Falha ao enviar email de reembolso:", emailError);
        // Don't fail the refund if email fails
      }
    }

    return NextResponse.json({
      success: true,
      refundId: withdrawal.id,
      status: withdrawal.status,
      amount: withdrawal.amount,
    });
  } catch (error) {
    console.error("Erro ao processar reembolso:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json(
      { error: `Falha ao processar reembolso: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * Mascara a chave PIX para logs seguros
 */
function maskPixKey(key: string): string {
  if (key.includes("@")) {
    const [user, domain] = key.split("@");
    return `${user.slice(0, 3)}***@${domain}`;
  }
  if (key.length >= 8) {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  }
  return "***";
}
