import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

class PaymentService {
  private static instance: PaymentService;
  private stripe: Promise<any>;

  private constructor() {
    console.log('PaymentService: Inicializando...');
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    console.log('PaymentService: Chave pública do Stripe encontrada?', !!stripeKey);
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
      console.log('PaymentService: Iniciando processo de assinatura para usuário:', userId);

      // Buscar o usuário atual para obter o email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        throw new Error('Email do usuário não encontrado');
      }

      // Verificar se temos as variáveis de ambiente necessárias
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('PaymentService: Verificando variáveis de ambiente:', {
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseAnonKey: !!supabaseAnonKey,
        supabaseUrl
      });

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Configurações do Supabase não encontradas');
      }

      console.log('PaymentService: Chamando função Edge create-checkout-session');

      const { data, error } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: {
            userId,
            email: user.email,
            returnUrl: window.location.origin
          }
        }
      );

      console.log('PaymentService: Resposta da função:', { data, error });

      if (error) {
        console.error('PaymentService: Erro na chamada da função:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          details: error
        });
        throw error;
      }

      if (!data || !data.sessionId) {
        console.error('PaymentService: Resposta inválida:', data);
        throw new Error('Resposta inválida do servidor');
      }

      // Redirecionar para checkout do Stripe
      const stripe = await this.stripe;
      
      if (!stripe) {
        throw new Error('Erro ao inicializar Stripe');
      }

      console.log('PaymentService: Redirecionando para Stripe com sessionId:', data.sessionId);

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (stripeError) {
        console.error('PaymentService: Erro no redirecionamento Stripe:', stripeError);
        throw stripeError;
      }
    } catch (error) {
      console.error('PaymentService: Erro no processo de assinatura:', {
        message: error.message,
        stack: error.stack,
        type: error.name,
        details: error
      });
      throw new Error(`Erro na chamada da função: ${error.message}`);
    }
  }

  async handleSubscriptionSuccess(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('handle-subscription-success', {
        body: { sessionId }
      });

      if (error) {
        console.error('Erro ao processar sucesso da assinatura:', error);
        throw new Error('Erro ao finalizar assinatura');
      }
    } catch (error) {
      console.error('Erro ao processar callback do Stripe:', error);
      throw error;
    }
  }
}

export const paymentService = PaymentService.getInstance(); 