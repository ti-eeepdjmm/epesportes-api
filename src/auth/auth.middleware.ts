// src/auth/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface TokenRequest extends Request {
  accessToken?: string;
  refreshToken?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: TokenRequest, res: Response, next: NextFunction) {
    // extrai Authorization
    const authHeader = req.headers['authorization'];
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      req.accessToken = authHeader.slice(7);
    }

    // extrai x-refresh-token
    const refresh = req.headers['x-refresh-token'];
    if (typeof refresh === 'string') {
      req.refreshToken = refresh;
    }

    next();
  }
}
