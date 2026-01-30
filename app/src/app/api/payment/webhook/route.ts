import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/webhook
 * Recebe webhooks de pagamento (Stripe e Abacate Pay)
 *
 * TODO: Implementar validação de assinatura e processamento
 * - Validar webhook signature (STRIPE_WEBHOOK_SECRET / ABACATE_WEBHOOK_SECRET)
 * - Processar eventos de pagamento confirmado
 * - Atualizar créditos do usuário
 * - Enviar email de confirmação
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") ||
                      request.headers.get("x-abacate-signature");

    // Identifica origem do webhook
    const isStripe = request.headers.get("stripe-signature") !== null;
    const isAbacate = request.headers.get("x-abacate-signature") !== null;

    if (!signature) {
      return NextResponse.json(
        { error: "Assinatura de webhook ausente" },
        { status: 401 }
      );
    }

    // TODO: Validar assinatura
    // if (isStripe) {
    //   const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    //   const event = stripe.webhooks.constructEvent(
    //     body,
    //     signature,
    //     process.env.STRIPE_WEBHOOK_SECRET
    //   );
    //   // Processar evento
    // }

    // TODO: Processar eventos
    // - checkout.session.completed (Stripe)
    // - payment.confirmed (Abacate Pay)
    // - Atualizar créditos do usuário
    // - Enviar email de confirmação via Resend

    console.log("Webhook recebido:", { isStripe, isAbacate });

    return NextResponse.json(
      {
        received: true,
        message: "Webhook processado (integração pendente)",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
