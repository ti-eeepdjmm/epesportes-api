import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { supabaseClientProvider } from './supabase-client.provider';
import { AppGatewayModule } from 'src/app-gateway/app-gateway.module';

@Module({
  imports: [ConfigModule, AppGatewayModule],
  controllers: [AuthController],
  providers: [AuthService, supabaseClientProvider],
  exports: [supabaseClientProvider],
})
export class AuthModule {}
