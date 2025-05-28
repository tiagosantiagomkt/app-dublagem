export const STRIPE_PRODUCTS = {
  MONTHLY_PLAN: {
    priceId: 'price_1RSrfuF3R6PCXoXVZ18WfyDS',
    productId: 'prod_SNcv9yqXEalR9P',
    name: 'Plano Mensal NAZE DUB',
    description: 'Acesso ilimitado a todos os recursos de dublagem',
    mode: 'subscription' as const,
    price: 29.99,
    currency: 'BRL',
    interval: 'month' as const,
    features: [
      'Dublagem ilimitada de vídeos',
      'Todas as vozes disponíveis',
      'Suporte prioritário',
      'Sem compromisso - cancele quando quiser',
      'Processamento em alta prioridade',
      'Remoção de ruído avançada'
    ]
  }
} as const;

export type StripePriceId = typeof STRIPE_PRODUCTS[keyof typeof STRIPE_PRODUCTS]['priceId'];
export type StripeMode = typeof STRIPE_PRODUCTS[keyof typeof STRIPE_PRODUCTS]['mode'];

export function getProductByPriceId(priceId: string) {
  return Object.values(STRIPE_PRODUCTS).find(product => product.priceId === priceId);
}