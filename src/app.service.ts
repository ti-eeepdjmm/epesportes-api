// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): string {
    return '🚀 Bem-vindo à API EPesportes!';
  }

  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }
}
