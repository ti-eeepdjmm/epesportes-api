import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { Poll, PollSchema } from './schemas/poll.schema';
import { AppGatewayModule } from '../app-gateway/app-gateway.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Poll.name, schema: PollSchema }]),
    AppGatewayModule,
    NotificationsModule,
  ],
  controllers: [PollsController],
  providers: [PollsService],
})
export class PollsModule {}
