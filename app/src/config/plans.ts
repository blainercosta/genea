/**
 * Configuração de planos de preços do Genea
 * Single source of truth para toda a aplicação
 */

export interface PricingPlan {
  id: string;
  name: string;
  photos: number;
  price: number;
  unitPrice: string | null;
  benefits: string[];
  popular?: boolean;
}

export const PLANS: PricingPlan[] = [
  {
    id: "1",
    name: "UMA MEMÓRIA",
    photos: 1,
    price: 9.9,
    unitPrice: null,
    benefits: [
      "Restauração completa",
      "Ajustes até você gostar",
      "Download em alta qualidade",
    ],
  },
  {
    id: "2",
    name: "ÁLBUM",
    photos: 5,
    price: 29.9,
    unitPrice: "R$ 5,98 cada",
    benefits: [
      "Tudo da opção anterior",
      "Fila mais rápida",
      "Suporte por WhatsApp",
    ],
    popular: true,
  },
  {
    id: "3",
    name: "ACERVO",
    photos: 15,
    price: 59.9,
    unitPrice: "R$ 3,99 cada",
    benefits: [
      "Tudo da opção anterior",
      "Atendimento dedicado",
      "Ajuda pra organizar suas fotos",
    ],
  },
];

/**
 * Busca um plano pelo ID
 */
export function getPlanById(id: string): PricingPlan | undefined {
  return PLANS.find((plan) => plan.id === id);
}

/**
 * Mapa de planos para lookup rápido
 */
export const PLANS_MAP = PLANS.reduce(
  (acc, plan) => {
    acc[plan.id] = plan;
    return acc;
  },
  {} as Record<string, PricingPlan>
);

/**
 * Formata preço em reais
 */
export function formatPrice(price: number): string {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
}

/**
 * Get the default (popular) plan - used for fallback values
 */
export function getDefaultPlan(): PricingPlan {
  return PLANS.find((plan) => plan.popular) || PLANS[1];
}

/**
 * Default plan values for quick access
 */
export const DEFAULT_PLAN = getDefaultPlan();
