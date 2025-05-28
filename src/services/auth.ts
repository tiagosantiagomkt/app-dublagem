import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  freeTrialUsed: boolean;
  isSubscribed: boolean;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Erro de autenticação:', authError);
        throw new Error('Email ou senha incorretos');
      }

      if (!authData.user) {
        throw new Error('Erro ao fazer login');
      }

      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw new Error('Erro ao carregar perfil do usuário');
      }

      return {
        id: profile.id,
        email: profile.email,
        freeTrialUsed: profile.free_trial_used || false,
        isSubscribed: profile.is_subscribed || false
      };
    } catch (error) {
      console.error('Erro ao processar login:', error);
      throw error;
    }
  }

  async signup(email: string, password: string): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email: email
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        throw new Error('Erro ao criar conta: ' + error.message);
      }

      if (!data.user) {
        throw new Error('Erro ao criar usuário');
      }

      // Criar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            free_trial_used: false,
            is_subscribed: false
          }
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        throw new Error('Erro ao criar perfil do usuário');
      }
    } catch (error: any) {
      console.error('Erro no processo de cadastro:', error);
      throw new Error(error.message || 'Erro durante o cadastro');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !profile) {
        return null;
      }

      return {
        id: profile.id,
        email: profile.email,
        freeTrialUsed: profile.free_trial_used || false,
        isSubscribed: profile.is_subscribed || false
      };
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }
}

export const authService = AuthService.getInstance();
export type { User };