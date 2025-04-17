// src/auth/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { User } from '@supabase/supabase-js';
import { Request, Response } from 'express';

// Extendemos o Request do Express para incluir nossos tokens e user
interface TokenRequest extends Request {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1) Rotas marcadas como públicas não requerem validação
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2) Pega o host HTTP, tipando request e response
    const http = context.switchToHttp();
    const req = http.getRequest<TokenRequest>();
    const res = http.getResponse<Response>();

    let user: User | undefined;

    // 3) Tenta validar o accessToken (extraído pelo middleware)
    if (req.accessToken) {
      try {
        user = await this.authService.validateToken(req.accessToken);
      } catch {
        user = undefined;
      }
    }

    // 4) Se falhar, tenta fazer refresh com o refreshToken
    if (!user && req.refreshToken) {
      try {
        // Aqui garantimos o tipo de retorno de refreshSession
        const { session, user: refreshedUser } =
          await this.authService.refreshSession(req.refreshToken);

        // 5) Devolve os novos tokens nos headers da resposta
        res.setHeader('Authorization', `Bearer ${session.access_token}`);
        res.setHeader('x-refresh-token', session.refresh_token);

        user = refreshedUser;
      } catch {
        user = undefined;
      }
    }

    // 6) Se ainda não autenticou, lança 401
    if (!user) {
      throw new UnauthorizedException('User not authenticated.');
    }

    // 7) Anexa o usuário validado ao request e libera a rota
    req.user = user;
    return true;
  }
}
