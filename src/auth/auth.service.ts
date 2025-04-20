import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
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
  private readonly logger = new Logger(AuthService.name);
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
          emailRedirectTo: process.env.APP_CALLBACK_URL,
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
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // 401 para credenciais inválidas
        if (
          error.status === 400 ||
          /invalid login credentials/i.test(error.message)
        ) {
          throw new UnauthorizedException('E‑mail ou senha inválidos');
        }
        // 400 para outro tipo de erro de validação
        throw new BadRequestException(error.message);
      }

      // garante que data.user e data.session existam
      if (!data.user || !data.session) {
        throw new UnauthorizedException('Não foi possível autenticar');
      }

      return {
        user: data.user,
        session: data.session,
      };
    } catch (err: any) {
      // repassa exceções já mapeadas
      if (
        err instanceof BadRequestException ||
        err instanceof UnauthorizedException
      ) {
        throw err;
      }
      // log para depuração e retorna 500
      this.logger.error('Erro inesperado durante login', err);
      throw new InternalServerErrorException(
        'Erro interno ao processar o login. Tente novamente mais tarde.',
      );
    }
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
        redirectTo: process.env.WEB_CALLBACK_URL,
        queryParams: {
          prompt: 'select_account', // 👉 força mostrar a tela de escolha
        },
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
      redirectTo: process.env.APP_CALLBACK_URL,
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

  /** Extrai o usuário de um access_token válido */
  async validateToken(accessToken: string): Promise<User> {
    const { data, error } = await this.supabase.auth.getUser(accessToken);
    if (error || !data.user) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return data.user;
  }

  /** Tenta trocar o refreshToken por uma nova sessão */
  async refreshSession(
    refreshToken: string,
  ): Promise<{ session: Session; user: User }> {
    // supabase-js v2
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException(
        'Refresh token inválido ou expirado, faça login novamente',
      );
    }

    return {
      session: data.session,
      user: data.user,
    };
  }
}
