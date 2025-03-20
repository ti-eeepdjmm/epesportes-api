import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineupService } from './lineup.service';
import { LineupController } from './lineup.controller';
import { Lineup } from './entities/lineup.entity';
import { Team } from '../teams/entities/team.entity';
import { Match } from '../matches/entities/match.entity';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lineup, Team, Match, Player])],
  controllers: [LineupController],
  providers: [LineupService],
})
export class LineupModule {}
