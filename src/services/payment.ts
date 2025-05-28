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

      // Construct the correct Edge Function URL
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          userId,
          email: user.email,
          returnUrl: window.location.origin
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar sessão de checkout');
      }

      const { url } = await response.json();
      if (!url) {
        throw new Error('URL de checkout não retornada');
      }

      window.location.href = url;
    } catch (error) {
      console.error('Erro no processo de assinatura:', error);
      throw error;
    }
  }
}

export const paymentService = PaymentService.getInstance();