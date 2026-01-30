import { NextRequest, NextResponse } from "next/server";
import { getPlanById } from "@/config/plans";

/**
 * POST /api/payment/pix
 * Gera um código PIX para pagamento via Abacate Pay
 *
 * TODO: Integrar com Abacate Pay API
 * - Documentação: https://docs.abacatepay.com/
 * - Configurar ABACATE_API_KEY no .env.local
 * - Gerar QR Code e código copia/cola
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

    // TODO: Implementar integração com Abacate Pay
    // const response = await fetch("https://api.abacatepay.com/v1/billing/pix", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${process.env.ABACATE_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     amount: plan.price,
    //     description: `Genea - ${plan.name}`,
    //     customer: { email },
    //     metadata: { planId, photos: plan.photos },
    //   }),
    // });

    return NextResponse.json(
      {
        error: "Integração com Abacate Pay não implementada",
        message: "Configure ABACATE_API_KEY e implemente o PIX",
        plan,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Erro ao gerar PIX:", error);
    return NextResponse.json(
      { error: "Erro ao gerar código PIX" },
      { status: 500 }
    );
  }
}
