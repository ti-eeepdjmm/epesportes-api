import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient, Session, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase-client.provider';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

interface AuthResponse {
  user: User | null;
  session: Session | null;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async register({
    full_name,
    email,
    password,
  }: RegisterDto): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,
        },
      },
    });

    if (error) {
      throw new Error(error.message || 'Unexpected error during registration');
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
      throw new Error(error.message || 'Unexpected error during login');
    }

    return {
      user: data.user ?? null,
      session: data.session ?? null,
    };
  }

  async getUser(token: string): Promise<User> {
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error(error?.message || 'Unexpected error retrieving user');
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
      throw new Error(error.message || 'Unexpected error during Google login');
    }

    if (!data?.url) {
      throw new Error('No URL returned from Supabase');
    }

    return { url: data.url };
  }

  async recoverPassword(email: string): Promise<{ message: string }> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.RESET_PASSWORD_REDIRECT_URL,
    });

    if (error) {
      throw new Error(error.message || 'Error requesting password recovery');
    }

    return { message: 'Password recovery email sent successfully' };
  }

  async logout(): Promise<{ message: string }> {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      throw new Error(error.message ?? 'Error during logout');
    }

    return { message: 'Logout successful' };
  }

  async updatePassword({
    newPassword,
  }: UpdatePasswordDto): Promise<{ message: string }> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message || 'Error updating password');
    }

    return { message: 'Password updated successfully' };
  }
}
