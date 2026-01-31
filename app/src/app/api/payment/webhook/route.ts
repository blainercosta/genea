import { NextRequest, NextResponse } from "next/server";
import {
  validateWebhookSignature,
  parseWebhookEvent,
  type AbacateWebhookEvent,
} from "@/lib/abacate";
import { getPlanById } from "@/config/plans";
import { sendPaymentConfirmedEmail, sendRefundProcessedEmail, isResendConfigured } from "@/lib/resend";

/**
 * POST /api/payment/webhook
 * Recebe webhooks de pagamento do Abacate Pay
 *
 * Eventos processados:
 * - BILLING_PAID: Pagamento confirmado
 * - BILLING_EXPIRED: PIX expirou
 * - BILLING_REFUNDED: Reembolso processado
 *
 * Para configurar o webhook no Abacate Pay:
 * 1. Acesse o dashboard do Abacate Pay
 * 2. Configure a URL: https://seu-dominio.com/api/payment/webhook
 * 3. Copie o webhook secret e configure ABACATE_WEBHOOK_SECRET no .env
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Identifica origem do webhook
    const abacateSignature = request.headers.get("x-abacate-signature");
    const stripeSignature = request.headers.get("stripe-signature");

    // Webhook do Abacate Pay
    if (abacateSignature || (!stripeSignature && body)) {
      return handleAbacateWebhook(body, abacateSignature);
    }

    // Webhook do Stripe (TODO: implementar quando integrar Stripe)
    if (stripeSignature) {
      console.log("Webhook Stripe recebido - integração pendente");
      return NextResponse.json({ received: true, provider: "stripe" });
    }

    return NextResponse.json(
      { error: "Webhook não reconhecido" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}

/**
 * Processa webhook do Abacate Pay
 */
async function handleAbacateWebhook(
  body: string,
  signature: string | null
): Promise<NextResponse> {
  // SECURITY: Always validate webhook signature
  if (!validateWebhookSignature(body, signature)) {
    console.error("Webhook signature validation failed");
    return NextResponse.json(
      { error: "Assinatura inválida" },
      { status: 401 }
    );
  }

  // Parse do evento
  let event: AbacateWebhookEvent;
  try {
    event = parseWebhookEvent(body);
  } catch {
    console.error("Payload de webhook inválido:", body);
    return NextResponse.json(
      { error: "Payload inválido" },
      { status: 400 }
    );
  }

  // Validate required fields
  if (!event.event || !event.data?.id) {
    console.error("Webhook missing required fields:", event);
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes" },
      { status: 400 }
    );
  }

  console.log("Webhook Abacate Pay recebido:", {
    event: event.event,
    id: event.data.id,
    status: event.data.status,
    amount: event.data.amount,
  });

  // Processa baseado no tipo de evento
  switch (event.event) {
    case "BILLING_PAID":
      await handlePaymentConfirmed(event);
      break;

    case "BILLING_EXPIRED":
      console.log("PIX expirado:", event.data.id);
      break;

    case "BILLING_REFUNDED":
      await handleRefund(event);
      break;

    default:
      console.log("Evento desconhecido:", event.event);
  }

  return NextResponse.json({ received: true, event: event.event });
}

/**
 * Processa pagamento confirmado
 *
 * NOTA: Como não há banco de dados, os créditos são gerenciados
 * via localStorage no cliente. O webhook serve para:
 * 1. Logging/auditoria
 * 2. Envio de email de confirmação
 * 3. Validação de integridade do pagamento
 * 4. Possível integração futura com banco de dados
 */
async function handlePaymentConfirmed(event: AbacateWebhookEvent) {
  const { metadata } = event.data;

  const planId = metadata?.planId;
  const email = metadata?.email;
  const photos = metadata?.photos;
  const name = metadata?.name;

  const amountInReais = event.data.amount / 100;

  console.log("Pagamento confirmado:", {
    pixId: event.data.id,
    amount: amountInReais,
    planId,
    email,
    photos,
  });

  // SECURITY: Validate metadata exists
  if (!planId || !email) {
    console.error("SECURITY WARNING: Payment missing required metadata", {
      pixId: event.data.id,
      planId,
      email,
    });
    // Still process (payment was made) but log for investigation
  }

  // Busca dados do plano
  const plan = planId ? getPlanById(planId) : null;

  // SECURITY: Validate amount matches plan price
  if (plan) {
    const expectedAmount = plan.price;
    const tolerance = 0.01; // Allow 1 cent tolerance for rounding

    if (Math.abs(amountInReais - expectedAmount) > tolerance) {
      console.error("SECURITY WARNING: Payment amount mismatch!", {
        pixId: event.data.id,
        receivedAmount: amountInReais,
        expectedAmount,
        planId,
        email,
      });
      // Log but still process - payment was made, investigate later
    }

    console.log("Plano adquirido:", {
      name: plan.name,
      photos: plan.photos,
      price: plan.price,
      amountPaid: amountInReais,
      validated: Math.abs(amountInReais - expectedAmount) <= tolerance,
    });
  } else if (planId) {
    console.error("SECURITY WARNING: Unknown planId in webhook", {
      pixId: event.data.id,
      planId,
    });
  }

  // Envia email de confirmação
  if (email && isResendConfigured()) {
    try {
      const result = await sendPaymentConfirmedEmail(
        email,
        plan?.name || `${photos} fotos`,
        plan?.photos || parseInt(photos || "0"),
        amountInReais,
        name
      );

      if (result.success) {
        console.log("Email de confirmação enviado:", result.id);
      } else {
        console.error("Erro ao enviar email de confirmação:", result.error);
      }
    } catch (error) {
      console.error("Falha ao enviar email de confirmação:", error);
    }
  }
}

/**
 * Processa reembolso
 */
async function handleRefund(event: AbacateWebhookEvent) {
  const { metadata } = event.data;
  const email = metadata?.email;
  const name = metadata?.name;
  const amountInReais = event.data.amount / 100;

  console.log("Reembolso processado:", {
    pixId: event.data.id,
    amount: amountInReais,
    email,
  });

  // Envia email de reembolso
  if (email && isResendConfigured()) {
    try {
      const result = await sendRefundProcessedEmail(email, amountInReais, name);

      if (result.success) {
        console.log("Email de reembolso enviado:", result.id);
      } else {
        console.error("Erro ao enviar email de reembolso:", result.error);
      }
    } catch (error) {
      console.error("Falha ao enviar email de reembolso:", error);
    }
  }
}
