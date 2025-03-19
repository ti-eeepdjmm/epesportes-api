import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamStandingsService } from './team_standings.service';
import { TeamStandingsController } from './team_standings.controller';
import { TeamStanding } from './entities/team_standing.entity';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamStanding, Team])],
  controllers: [TeamStandingsController],
  providers: [TeamStandingsService],
})
export class TeamStandingsModule {}
