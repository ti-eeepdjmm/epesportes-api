import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase-client.provider';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // deixa passar, o guard vai cuidar
      }

      const token = authHeader.replace('Bearer ', '');
      const { data, error } = await this.supabase.auth.getUser(token);
      if (error || !data?.user) {
        return next(
          new UnauthorizedException('Token inválido ou usuário não encontrado'),
        );
      }

      (req as AuthenticatedRequest).user = data.user;
      next();
    } catch (err) {
      next(err);
    }
  }
}
