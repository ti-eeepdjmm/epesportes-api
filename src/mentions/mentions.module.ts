import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentionsService } from './mentions.service';
import { MentionsController } from './mentions.controller';
import { Mention } from './entities/mention.entity';
import { User } from '../users/entities/user.entity';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mention, User, Player])],
  controllers: [MentionsController],
  providers: [MentionsService],
})
export class MentionsModule {}
