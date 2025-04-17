// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { supabaseClientProvider } from './supabase-client.provider';
import { AppGatewayModule } from 'src/app-gateway/app-gateway.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  // ⬇️ Os módulos que este módulo importa
  imports: [
    ConfigModule, // Carrega variáveis de ambiente do .env
    AppGatewayModule, // Permite enviar notificações via WebSocket (se usado no fluxo de auth)
  ],

  // ⬇️ Os controllers que ficam responsáveis por expor as rotas de autenticação
  controllers: [
    AuthController, // Define endpoints como /auth/login, /auth/register, etc.
  ],

  // ⬇️ Os providers são classes ou valores injetáveis no container do Nest
  providers: [
    AuthService, // Lógica de registro, login, refresh, etc.
    supabaseClientProvider, // Provider que instancia o SupabaseClient com a service role key
    {
      // Aqui registramos o guard globalmente
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // JwtAuthGuard será aplicado em TODAS as rotas (exceto marcadas @Public())
    },
  ],

  // ⬇️ O que este módulo exporta para outros módulos
  exports: [
    supabaseClientProvider, // Permite que outros módulos (ex.: AppModule) também injetem o SupabaseClient
  ],
})
export class AuthModule {}
