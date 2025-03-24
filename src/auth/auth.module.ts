// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { supabaseClientProvider } from './supabase-client.provider';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, supabaseClientProvider],
})
export class AuthModule {}
