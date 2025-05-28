import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

class PaymentService {
  private static instance: PaymentService;
  private stripe: Promise<any>;

  private constructor() {
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!stripeKey) {
      throw new Error('Chave pública do Stripe não encontrada no arquivo .env');
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
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          // Add CORS headers
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({
          userId,
          email: user.email,
          returnUrl: `${import.meta.env.VITE_APP_URL || window.location.origin}`
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar sessão de checkout');
      }

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error('ID da sessão não retornado');
      }

      const stripe = await this.stripe;
      if (!stripe) {
        throw new Error('Erro ao inicializar Stripe');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (error) {
      console.error('Erro no processo de assinatura:', error);
      throw new Error(`Erro ao processar pagamento: ${error.message}`);
    }
  }

  async handleSubscriptionSuccess(sessionId: string): Promise<void> {
    try {
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-subscription-success`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          // Add CORS headers
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        throw new Error('Erro ao processar sucesso da assinatura');
      }
    } catch (error) {
      console.error('Erro ao processar callback do Stripe:', error);
      throw error;
    }
  }
}

export const paymentService = PaymentService.getInstance();