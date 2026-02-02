import { NextRequest, NextResponse } from "next/server";
import {
  validateWebhookSignature,
  type AbacateWebhookEvent,
} from "@/lib/abacate";
import { getPlanById } from "@/config/plans";
import { sendPaymentConfirmedEmail, sendRefundProcessedEmail, isResendConfigured } from "@/lib/resend";
import {
  getOrCreateUser,
  addUserCredits,
  updateUserProfile,
  getSupabase,
  isSupabaseConfigured,
} from "@/lib/supabase";

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
    const url = new URL(request.url);

    // Identifica origem do webhook
    const abacateSignature = request.headers.get("x-webhook-signature");
    const querySecret = url.searchParams.get("webhookSecret");
    const stripeSignature = request.headers.get("stripe-signature");

    // Webhook do Abacate Pay
    if (abacateSignature || querySecret || (!stripeSignature && body)) {
      return handleAbacateWebhook(body, abacateSignature, querySecret);
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
 * Formato real do webhook do Abacate Pay
 */
interface AbacateWebhookPayload {
  event: string;
  data: {
    pixQrCode: {
      id: string;
      amount: number;
      kind: string;
      status: string;
      metadata?: Record<string, string>;
    };
    payment: {
      amount: number;
      fee: number;
      method: string;
    };
  };
  devMode: boolean;
}

/**
 * Processa webhook do Abacate Pay
 */
async function handleAbacateWebhook(
  body: string,
  signature: string | null,
  querySecret: string | null
): Promise<NextResponse> {
  // SECURITY: Always validate webhook signature
  if (!validateWebhookSignature(body, signature, querySecret)) {
    console.error("Webhook signature validation failed");
    return NextResponse.json(
      { error: "Assinatura inválida" },
      { status: 401 }
    );
  }

  // Parse do evento
  let payload: AbacateWebhookPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    console.error("Payload de webhook inválido:", body);
    return NextResponse.json(
      { error: "Payload inválido" },
      { status: 400 }
    );
  }

  // Validate required fields
  if (!payload.event || !payload.data?.pixQrCode?.id) {
    console.error("Webhook missing required fields:", payload);
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes" },
      { status: 400 }
    );
  }

  const { pixQrCode } = payload.data;

  console.log("Webhook Abacate Pay recebido:", {
    event: payload.event,
    id: pixQrCode.id,
    status: pixQrCode.status,
    amount: pixQrCode.amount,
    devMode: payload.devMode,
  });

  // Converte para formato interno
  const event: AbacateWebhookEvent = {
    event: payload.event.toUpperCase().replace(".", "_") as AbacateWebhookEvent["event"],
    data: {
      id: pixQrCode.id,
      status: pixQrCode.status,
      amount: pixQrCode.amount,
      metadata: pixQrCode.metadata,
    },
  };

  // Processa baseado no tipo de evento
  switch (payload.event) {
    case "billing.paid":
      await handlePaymentConfirmed(event);
      break;

    case "billing.expired":
      console.log("PIX expirado:", pixQrCode.id);
      break;

    case "billing.refunded":
      await handleRefund(event);
      break;

    default:
      console.log("Evento desconhecido:", payload.event);
  }

  return NextResponse.json({ received: true, event: payload.event });
}

/**
 * Processa pagamento confirmado
 *
 * 1. Adiciona créditos ao usuário no Supabase
 * 2. Registra o pagamento na tabela payments
 * 3. Envia email de confirmação
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
  const creditsToAdd = plan?.photos || parseInt(photos || "0");

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

  // Adiciona créditos no Supabase
  if (email && isSupabaseConfigured()) {
    try {
      // Get or create user
      const user = await getOrCreateUser(email);

      if (user) {
        // Update user profile if name provided
        if (name) {
          await updateUserProfile(user.id, { name });
        }

        // Add credits
        const creditsAdded = await addUserCredits(user.id, creditsToAdd);

        if (creditsAdded) {
          console.log("Créditos adicionados no Supabase:", {
            userId: user.id,
            email,
            credits: creditsToAdd,
            newTotal: user.credits + creditsToAdd,
          });

          // Register payment in database
          const supabase = getSupabase();
          if (supabase) {
            const { error: paymentError } = await supabase.from("payments").insert({
              user_id: user.id,
              pix_id: event.data.id,
              plan_id: planId || "unknown",
              amount: amountInReais,
              credits: creditsToAdd,
              status: "completed",
              completed_at: new Date().toISOString(),
            } as never);

            if (paymentError) {
              console.error("Erro ao registrar pagamento:", paymentError);
            } else {
              console.log("Pagamento registrado no banco:", event.data.id);
            }
          }
        } else {
          console.error("Falha ao adicionar créditos:", { userId: user.id, email });
        }
      } else {
        console.error("Falha ao criar/buscar usuário:", email);
      }
    } catch (error) {
      console.error("Erro ao processar créditos no Supabase:", error);
    }
  } else if (!isSupabaseConfigured()) {
    console.warn("Supabase não configurado - créditos não persistidos");
  }

  // Envia email de confirmação
  if (email && isResendConfigured()) {
    try {
      const result = await sendPaymentConfirmedEmail(
        email,
        plan?.name || `${photos} fotos`,
        creditsToAdd,
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
