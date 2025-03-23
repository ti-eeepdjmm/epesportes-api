import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { User } from '@supabase/supabase-js';

// Custom request interface with authenticated user
interface AuthenticatedRequest extends Request {
  user?: User; // or define your own shape, e.g. { id: string; email: string }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route or controller is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Get request and validate user presence
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      console.warn('Access denied: user not authenticated.');
      throw new UnauthorizedException('User not authenticated.');
    }

    return true;
  }
}
