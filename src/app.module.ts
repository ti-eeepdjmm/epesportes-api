import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { LineupsModule } from './lineups/lineups.module';
import { GamesModule } from './games/games.module';
import { MatchesModule } from './matches/matches.module';
import { MatchStatsModule } from './match_stats/match_stats.module';
import { RankingsModule } from './rankings/rankings.module';
import { TeamStandingsModule } from './team_standings/team_standings.module';
import { EngagementStatsModule } from './engagement_stats/engagement_stats.module';
import { UserPreferencesModule } from './user_preferences/user_preferences.module';
import { TimelinePostsModule } from './timeline_posts/timeline_posts.module';
import { MentionsModule } from './mentions/mentions.module';

@Module({
  imports: [
    // ConfigModule: Carrega variáveis do .env e torna-as globais
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeORM: Conexão com PostgreSQL via variável de ambiente
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      }),
    }),

    // Mongoose: Conexão com MongoDB via variável de ambiente
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    // Módulos da aplicação
    UsersModule,
    TeamsModule,
    PlayersModule,
    LineupsModule,
    GamesModule,
    MatchesModule,
    MatchStatsModule,
    RankingsModule,
    TeamStandingsModule,
    EngagementStatsModule,
    UserPreferencesModule,
    TimelinePostsModule,
    MentionsModule,
  ],
})
export class AppModule {}
