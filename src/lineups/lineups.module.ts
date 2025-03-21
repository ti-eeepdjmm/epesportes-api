import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineupsService } from './lineups.service';
import { LineupsController } from './lineups.controller';
import { Lineup } from './entities/lineup.entity';
import { Team } from '../teams/entities/team.entity';
import { Match } from '../matches/entities/match.entity';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lineup, Team, Match, Player])],
  controllers: [LineupsController],
  providers: [LineupsService],
})
export class LineupsModule {}
