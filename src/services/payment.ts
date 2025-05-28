import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';
import { STRIPE_PRODUCTS } from '../stripe-config';

class PaymentService {
  private static instance: PaymentService;
  private stripe: Promise<any>;

  private constructor() {
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!stripeKey) {
      throw new Error('Chave pública do Stripe não encontrada');
    }
    this.stripe = loadStripe(stripeKey);
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async startSubscription(userId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        throw new Error('Email do usuário não encontrado');
      }

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          price_id: STRIPE_PRODUCTS.MONTHLY_PLAN.priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
          mode: 'subscription'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar sessão de checkout');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Erro no processo de assinatura:', error);
      throw new Error(`Erro ao processar pagamento: ${error.message}`);
    }
  }
}

export const paymentService = PaymentService.getInstance();