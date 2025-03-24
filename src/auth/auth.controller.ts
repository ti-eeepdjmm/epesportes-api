import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@supabase/supabase-js';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
