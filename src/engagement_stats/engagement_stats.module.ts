import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngagementStatsService } from './engagement_stats.service';
import { EngagementStatsController } from './engagement_stats.controller';
import { EngagementStat } from './entities/engagement_stat.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EngagementStat, User])],
  controllers: [EngagementStatsController],
  providers: [EngagementStatsService],
})
export class EngagementStatsModule {}