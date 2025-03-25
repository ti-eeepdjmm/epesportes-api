import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelinePostsService } from './timeline_posts.service';
import { TimelinePostsController } from './timeline_posts.controller';
import {
  TimelinePost,
  TimelinePostSchema,
} from './schemas/timeline_post.schema';
import { AppGatewayModule } from 'src/app-gateway/app-gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimelinePost.name, schema: TimelinePostSchema },
    ]),
    AppGatewayModule,
  ],
  controllers: [TimelinePostsController],
  providers: [TimelinePostsService],
})
export class TimelinePostsModule {}
