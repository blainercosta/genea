import { NextRequest, NextResponse } from "next/server";
import { getPlanById } from "@/config/plans";

/**
 * POST /api/payment/stripe
 * Cria uma sessão de checkout do Stripe
 *
 * TODO: Integrar com Stripe SDK
 * - npm install stripe
 * - Configurar STRIPE_SECRET_KEY no .env.local
 * - Criar sessão de checkout com Stripe Checkout
 */
export async function POST(request: NextRequest) {
  try {
    const { planId, email } = await request.json();

    if (!planId || !email) {
      return NextResponse.json(
        { error: "planId e email são obrigatórios" },
        { status: 400 }
      );
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 }
      );
    }

    // TODO: Implementar integração com Stripe
    // const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: [{
    //     price_data: {
    //       currency: "brl",
    //       product_data: { name: plan.name },
    //       unit_amount: Math.round(plan.price * 100),
    //     },
    //     quantity: 1,
    //   }],
    //   mode: "payment",
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-confirmed?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    //   customer_email: email,
    //   metadata: { planId, photos: plan.photos.toString() },
    // });

    return NextResponse.json(
      {
        error: "Integração com Stripe não implementada",
        message: "Configure STRIPE_SECRET_KEY e implemente o checkout",
        plan,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Erro no checkout Stripe:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
