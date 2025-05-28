import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Credenciais do Supabase não encontradas no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.x',
    },
  },
});

// Verificar conexão
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('Usuário conectado com sucesso');
  } else if (event === 'SIGNED_OUT') {
    console.log('Usuário desconectado');
  } else if (event === 'USER_UPDATED') {
    console.log('Dados do usuário atualizados');
  }
});