export const STRIPE_PRODUCTS = {
  MONTHLY_PLAN: {
    priceId: 'price_1QwmNEF3R6PCXoXV9BUeG3Z8',
    name: 'Plano Mensal',
    description: 'Acesso ilimitado a todos os recursos por um mês',
    mode: 'subscription' as const,
    price: 29.99,
    currency: 'BRL',
    interval: 'month' as const,
    features: [
      'Dublagem ilimitada de vídeos',
      'Acesso a todas as vozes',
      'Suporte prioritário',
      'Sem compromisso - cancele quando quiser'
    ]
  }
} as const;

export type StripePriceId = typeof STRIPE_PRODUCTS[keyof typeof STRIPE_PRODUCTS]['priceId'];
export type StripeMode = typeof STRIPE_PRODUCTS[keyof typeof STRIPE_PRODUCTS]['mode'];

export function getProductByPriceId(priceId: string) {
  return Object.values(STRIPE_PRODUCTS).find(product => product.priceId === priceId);
}