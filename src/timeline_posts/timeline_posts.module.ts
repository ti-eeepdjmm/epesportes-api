import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelinePostsService } from './timeline_posts.service';
import { TimelinePostsController } from './timeline_posts.controller';
import {
  TimelinePost,
  TimelinePostSchema,
} from './schemas/timeline_post.schema';
import { AppGatewayModule } from '../app-gateway/app-gateway.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimelinePost.name, schema: TimelinePostSchema },
    ]),
    TypeOrmModule.forFeature([User]), // ✅ registra o repositório do PostgreSQL
    AppGatewayModule,
  ],
  controllers: [TimelinePostsController],
  providers: [TimelinePostsService],
})
export class TimelinePostsModule {}
