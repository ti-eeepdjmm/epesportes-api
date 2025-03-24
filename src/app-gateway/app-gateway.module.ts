import { Module } from '@nestjs/common';
import { AppGateway } from './app/app.gateway';

@Module({
  providers: [AppGateway],
})
export class AppGatewayModule {}
