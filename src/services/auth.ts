import { supabase } from '../lib/supabase';

interface User {
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
    // 1. Fazer login
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

    try {
      // 2. Buscar ou criar perfil
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      // Se não encontrou o perfil, tenta criar um novo
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            email: authData.user.email!,
            free_trial_used: false,
            is_subscribed: false
          }])
          .select()
          .single();

        if (createError) {
          console.error('Erro ao criar perfil:', createError);
          // Tenta uma segunda vez com upsert
          const { data: upsertProfile, error: upsertError } = await supabase
            .from('profiles')
            .upsert([{
              id: authData.user.id,
              email: authData.user.email!,
              free_trial_used: false,
              is_subscribed: false
            }])
            .select()
          .single();

          if (upsertError) {
            console.error('Erro ao fazer upsert do perfil:', upsertError);
            throw new Error('Erro ao criar perfil do usuário');
        }
          profile = upsertProfile;
        } else {
          profile = newProfile;
        }
      }

      if (!profile) {
        throw new Error('Erro ao carregar perfil do usuário');
      }

      return {
        id: profile.id,
        email: profile.email,
        freeTrialUsed: profile.free_trial_used,
        isSubscribed: profile.is_subscribed
      };
    } catch (error) {
      console.error('Erro ao processar login:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao processar login');
    }
  }

  async signup(email: string, password: string): Promise<void> {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          email_confirm_sent: new Date().toISOString()
        }
      }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
      if (error.message.includes('Email rate limit exceeded')) {
        throw new Error('Muitas tentativas de envio de email. Por favor, aguarde alguns minutos e tente novamente.');
      }
      throw new Error('Erro ao criar conta: ' + error.message);
      }

    if (!data.user) {
        throw new Error('Erro ao criar usuário');
      }

    if (data.user.identities && data.user.identities.length === 0) {
      throw new Error('Este email já está cadastrado. Por favor, tente fazer login.');
    }

    // Verifica se o email foi enviado
    const { data: authConfig } = await supabase.auth.getSession();
    if (!authConfig) {
      throw new Error('Não foi possível enviar o email de confirmação. Por favor, tente novamente.');
      }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      freeTrialUsed: profile.free_trial_used,
      isSubscribed: profile.is_subscribed
    };
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  async useFreeVideo(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ free_trial_used: true })
      .eq('id', userId);

    if (error) {
      throw new Error('Erro ao atualizar uso do vídeo gratuito');
    }
  }
}

export const authService = AuthService.getInstance();
export type { User }; 