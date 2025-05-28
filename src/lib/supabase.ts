import { createClient } from '@supabase/supabase-js';

// TODO: Substituir com suas credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Verificando configuração do Supabase...');
console.log('URL configurada:', supabaseUrl ? 'Sim' : 'Não');
console.log('Chave anônima configurada:', supabaseAnonKey ? 'Sim' : 'Não');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Credenciais do Supabase não encontradas no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 