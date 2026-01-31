import { NextRequest, NextResponse } from "next/server";
import { getPlanById } from "@/config/plans";
import {
  generatePix,
  getPixStatus,
  isAbacateConfigured,
} from "@/lib/abacate";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import { isValidEmail, isValidCPF, isValidPhone } from "@/lib/validation";

/**
 * POST /api/payment/pix
 * Gera um código PIX para pagamento via Abacate Pay
 *
 * Request body:
 * - planId: ID do plano (1, 2, ou 3)
 * - email: Email do cliente
 * - name: Nome completo do cliente
 * - phone: Telefone do cliente
 * - taxId: CPF do cliente
 *
 * Response:
 * - pix: Dados do PIX (id, qrCode, copyPaste, expiresAt)
 * - plan: Dados do plano selecionado
 */
export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimitResponse = checkRateLimit(request, "pix", RATE_LIMITS.pix);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Verifica se a integração está configurada
    if (!isAbacateConfigured()) {
      return NextResponse.json(
        {
          error: "Pagamento via PIX temporariamente indisponível",
          message: "ABACATE_API_KEY não configurada",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { planId, email, name, phone, taxId } = body;

    // Validação dos campos obrigatórios
    if (!planId || !email || !name || !phone || !taxId) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios (planId, email, name, phone, taxId)" },
        { status: 400 }
      );
    }

    // Validação robusta de email
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Validação de CPF
    if (!isValidCPF(taxId)) {
      return NextResponse.json({ error: "CPF inválido" }, { status: 400 });
    }

    // Validação de telefone
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Telefone inválido" }, { status: 400 });
    }

    // Busca o plano
    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 }
      );
    }

    // Gera o PIX via Abacate Pay com os dados reais do cliente
    const pixData = await generatePix(
      plan.price,
      `Genea - ${plan.name} (${plan.photos} ${plan.photos === 1 ? "foto" : "fotos"})`,
      { email, name, cellphone: phone, taxId },
      {
        planId: plan.id,
        photos: plan.photos.toString(),
        email,
        name,
      }
    );

    return NextResponse.json({
      pix: pixData,
      plan: {
        id: plan.id,
        name: plan.name,
        photos: plan.photos,
        price: plan.price,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PIX:", error);

    const message =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json(
      { error: "Erro ao gerar código PIX", details: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payment/pix?id=xxx
 * Consulta o status de um pagamento PIX
 *
 * Query params:
 * - id: ID do PIX gerado
 *
 * Response:
 * - id: ID do PIX
 * - status: PENDING | COMPLETED | EXPIRED | REFUNDED
 * - amount: Valor em reais
 */
export async function GET(request: NextRequest) {
  try {
    if (!isAbacateConfigured()) {
      return NextResponse.json(
        { error: "Serviço temporariamente indisponível" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const pixId = searchParams.get("id");

    if (!pixId) {
      return NextResponse.json(
        { error: "ID do PIX é obrigatório" },
        { status: 400 }
      );
    }

    const status = await getPixStatus(pixId);

    return NextResponse.json(status);
  } catch (error) {
    console.error("Erro ao consultar PIX:", error);

    return NextResponse.json(
      { error: "Erro ao consultar status do PIX" },
      { status: 500 }
    );
  }
}
