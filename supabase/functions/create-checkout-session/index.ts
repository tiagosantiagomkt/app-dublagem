// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from 'https://esm.sh/stripe@12.0.0';

// Definição dos tipos
interface RequestPayload {
  userId: string;
  email: string;
  returnUrl?: string;
}

// Definição dos headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
};

console.info('Stripe checkout server started');

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Verificar método
    if (req.method !== 'POST') {
      throw new Error(`Método ${req.method} não suportado`);
    }

    // Verificar variáveis de ambiente
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripePriceId = Deno.env.get('STRIPE_PRICE_ID');

    if (!stripeSecretKey || !stripePriceId) {
      throw new Error('Variáveis de ambiente STRIPE_SECRET_KEY e/ou STRIPE_PRICE_ID não configuradas');
    }

    // Parse do body
    const { userId, email, returnUrl = 'http://localhost:5174' }: RequestPayload = await req.json();

    if (!userId || !email) {
      throw new Error('userId e email são obrigatórios');
    }

    console.log('Iniciando criação do cliente Stripe...');

    // Inicializar Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Criar cliente no Stripe
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        userId: userId,
      },
    });

    console.log('Cliente Stripe criado:', customer.id);
    console.log('Criando sessão de checkout...');

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto', 'pix'],
      mode: 'subscription',
      customer: customer.id,
      customer_email: email,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      payment_method_options: {
        boleto: {
          expires_after_days: 3,
        },
        pix: {
          expires_after_minutes: 120,
        },
        card: {
          installments: {
            enabled: true,
          },
        },
      },
      allow_promotion_codes: true,
      success_url: `${returnUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/cancel`,
      metadata: {
        userId: userId,
        email: email,
      },
      locale: 'pt-BR',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['BR'],
      },
      customer_creation: 'always',
      tax_id_collection: {
        enabled: true,
      },
      phone_number_collection: {
        enabled: true,
      },
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: userId,
          email: email,
        },
      },
    });

    console.log('Sessão de checkout criada:', session.id);

    // Retornar resposta de sucesso
    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        customer: customer.id 
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );

  } catch (error) {
    // Log do erro para debugging
    console.error('Erro na função create-checkout-session:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      details: error instanceof Error ? error : 'Erro desconhecido'
    });
    
    // Retornar erro
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        type: error instanceof Error ? error.name : 'UnknownError',
        details: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}); 