import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingsService } from './rankings.service';
import { RankingsController } from './rankings.controller';
import { Ranking } from './entities/ranking.entity';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ranking, Player])],
  controllers: [RankingsController],
  providers: [RankingsService],
})
export class RankingsModule {}
