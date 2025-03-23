import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient, Session, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase-client.provider';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface AuthResponse {
  user: User | null;
  session: Session | null;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async register({ email, password }: RegisterDto): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || 'Erro inesperado durante o registro');
    }

    return {
      user: data.user ?? null,
      session: data.session ?? null,
    };
  }

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || 'Erro inesperado durante o login');
    }

    return {
      user: data.user ?? null,
      session: data.session ?? null,
    };
  }

  async getUser(token: string): Promise<User> {
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error(error?.message || 'Erro inesperado ao obter usuário');
    }

    return data.user;
  }

  async loginWithGoogle(): Promise<{ url: string }> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.GOOGLE_REDIRECT_URL,
      },
    });

    if (error) {
      throw new Error(
        error.message || 'Erro inesperado ao realizar login com Google',
      );
    }

    if (!data?.url) {
      throw new Error('Nenhuma URL retornada pelo Supabase');
    }

    return { url: data.url };
  }
}
