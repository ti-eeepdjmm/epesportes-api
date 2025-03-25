import { Module } from '@nestjs/common';
import { AppGateway } from './app/app.gateway';

@Module({
  providers: [AppGateway],
  exports: [AppGateway],
})
export class AppGatewayModule {}
