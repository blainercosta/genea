/**
 * Integração com Stripe para pagamentos via cartão
 *
 * TODO: Implementar após obter credenciais
 * - npm install stripe @stripe/stripe-js
 * - Configurar STRIPE_SECRET_KEY no .env.local
 * - Configurar STRIPE_PUBLISHABLE_KEY no .env.local
 * - Configurar STRIPE_WEBHOOK_SECRET no .env.local
 *
 * Documentação: https://stripe.com/docs/api
 */

// import Stripe from "stripe";
//
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("STRIPE_SECRET_KEY não configurada");
// }
//
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2024-12-18.acacia",
// });

export const STRIPE_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  isConfigured: false,
};

/**
 * Verifica se o Stripe está configurado
 */
export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}
