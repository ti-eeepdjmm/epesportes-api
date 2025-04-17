import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Public } from './decorators/public.decorator';
import { getCallbackRedirectHtml } from './templates/callback-redirect.template';

// Extende o Request do Express para incluir o usuário autenticado
interface TokenRequest extends Request {
  user?: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registro de usuário — público
   */
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<unknown> {
    try {
      return await this.authService.register(dto);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro no registro de usuário';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Login — público. Define headers com tokens e retorna apenas o usuário
   */
  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: User | null }> {
    try {
      const { user, session } = await this.authService.login(dto);

      // Cabeçalhos para o cliente armazenar
      res.setHeader('Authorization', `Bearer ${session!.access_token}`);
      res.setHeader('x-refresh-token', session!.refresh_token);

      return { user };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Falha ao fazer login';
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Login com Google — público. Retorna URL de redirecionamento
   */
  @Public()
  @Get('login/google')
  async loginGoogle(): Promise<{ url: string }> {
    try {
      const data = await this.authService.loginWithGoogle();
      if (!data?.url) {
        throw new HttpException(
          'Erro ao obter URL de login com Google',
          HttpStatus.BAD_REQUEST,
        );
      }
      return { url: data.url };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro no login com Google';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Retorna dados do usuário autenticado — protegido
   */
  @Get('me')
  getProfile(@Req() req: TokenRequest): User {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return req.user;
  }

  /**
   * Solicita recuperação de senha — público
   */
  @Public()
  @Post('recover-password')
  async recoverPassword(
    @Body() dto: RecoverPasswordDto,
  ): Promise<{ message: string }> {
    try {
      return await this.authService.recoverPassword(dto.email);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao recuperar senha';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Atualiza senha do usuário autenticado — protegido
   */
  @Post('update-password')
  async updatePassword(
    @Req() req: TokenRequest,
    @Body() dto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    try {
      return await this.authService.updatePassword(dto);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao atualizar senha';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Logout do usuário autenticado — protegido
   */
  @Post('logout')
  async logout(): Promise<{ message: string }> {
    try {
      return await this.authService.logout();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao fazer logout';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Callback OAuth — público
   */
  @Public()
  @Get('callback-redirect')
  callbackRedirect(@Res() res: Response): void {
    res.setHeader('Content-Type', 'text/html');
    res.send(getCallbackRedirectHtml());
  }
}
