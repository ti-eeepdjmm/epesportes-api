import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match } from './entities/match.entity';
import { Game } from '../games/entities/game.entity';
import { Team } from '../teams/entities/team.entity';
import { AppGatewayModule } from 'src/app-gateway/app-gateway.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Game, Team]),
    AppGatewayModule,
    NotificationsModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
