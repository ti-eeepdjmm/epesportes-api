import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@supabase/supabase-js';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Public } from './decorators/public.decorator';
import { LoginWithTokenDto } from './dto/login-with-token.dto';

import { Response } from 'express';
import { getCallbackRedirectHtml } from './templates/callback-redirect.template';
import { getAuthResultHtml } from './templates/auth-result.template';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<unknown> {
    try {
      const result: unknown = await this.authService.register(registerDto);
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro inesperado';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<unknown> {
    try {
      const result: unknown = await this.authService.login(loginDto);
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro inesperado';
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('me')
  async getUser(@Headers('authorization') authHeader: string): Promise<User> {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new HttpException('Missing token', HttpStatus.UNAUTHORIZED);
    }
    try {
      const user = await this.authService.getUser(token);
      return user;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro inesperado';
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }
  @Public()
  @Get('login/google')
  async loginGoogle(): Promise<{ url: string }> {
    try {
      const data: { url: string } = await this.authService.loginWithGoogle();
      if (!data || !data.url) {
        throw new HttpException(
          'Erro ao obter URL de login com Google',
          HttpStatus.BAD_REQUEST,
        );
      }
      return { url: data.url };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro inesperado';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('login/token')
  async loginWithToken(@Body() dto: LoginWithTokenDto): Promise<unknown> {
    return this.authService.loginWithIdToken(dto);
  }
  // auth.controller.ts
  @Post('recover-password')
  async recoverPassword(@Body() dto: RecoverPasswordDto) {
    return this.authService.recoverPassword(dto.email);
  }

  @Post('update-password')
  async updatePassword(@Body() dto: UpdatePasswordDto) {
    return this.authService.updatePassword(dto);
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  @Public()
  @Get('callback-redirect')
  callbackRedirect(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/html');
    res.send(getCallbackRedirectHtml());
  }

  @Public()
  @Get('finish-google-login')
  finishGoogleLogin(@Query('token') token: string, @Res() res: Response) {
    if (!token) {
      return res.status(400).send('Token ausente');
    }

    const redirectUrl = `${process.env.APP_WEB_RETURN_URL}/auth/auth-result?token=${token}`;
    return res.redirect(redirectUrl);
  }

  @Public()
  @Get('auth-result')
  authResult(@Query('token') token: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/html');
    res.send(getAuthResultHtml(token));
  }
}
