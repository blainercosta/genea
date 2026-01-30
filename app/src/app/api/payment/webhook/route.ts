import { NextRequest, NextResponse } from "next/server";
import {
  validateWebhookSignature,
  parseWebhookEvent,
  type AbacateWebhookEvent,
} from "@/lib/abacate";
import { getPlanById } from "@/config/plans";

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
  // Valida assinatura se configurada
  if (signature && !validateWebhookSignature(body, signature)) {
    console.error("Assinatura de webhook inválida");
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

  console.log("Webhook Abacate Pay recebido:", {
    event: event.event,
    id: event.data.id,
    status: event.data.status,
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
      console.log("Reembolso processado:", event.data.id);
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
 * 2. Envio de email de confirmação (quando Resend estiver integrado)
 * 3. Possível integração futura com banco de dados
 */
async function handlePaymentConfirmed(event: AbacateWebhookEvent) {
  const { metadata } = event.data;

  const planId = metadata?.planId;
  const email = metadata?.email;
  const photos = metadata?.photos;

  console.log("Pagamento confirmado:", {
    pixId: event.data.id,
    amount: event.data.amount / 100, // centavos -> reais
    planId,
    email,
    photos,
  });

  // Busca dados do plano para log
  if (planId) {
    const plan = getPlanById(planId);
    if (plan) {
      console.log("Plano adquirido:", {
        name: plan.name,
        photos: plan.photos,
        price: plan.price,
      });
    }
  }

  // TODO: Enviar email de confirmação via Resend
  // if (email) {
  //   await sendEmail({
  //     to: email,
  //     template: "payment_confirmed",
  //     data: { photos, amount: event.data.amount / 100 },
  //   });
  // }
}
