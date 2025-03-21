import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchStatsService } from './match_stats.service';
import { MatchStatsController } from './match_stats.controller';
import { MatchStat } from './entities/match_stat.entity';
import { Match } from '../matches/entities/match.entity';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchStat, Match, Team])],
  controllers: [MatchStatsController],
  providers: [MatchStatsService],
})
export class MatchStatsModule {}
