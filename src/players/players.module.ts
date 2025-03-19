import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { Player } from './entities/player.entity';
import { User } from '../users/entities/user.entity';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, User, Team])],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}