import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { LineupModule } from './lineup/lineup.module';
import { GamesModule } from './games/games.module';
import { MatchesModule } from './matches/matches.module';
import { MatchStatsModule } from './match_stats/match_stats.module';

@Module({
  imports: [
    // ConfigModule: Módulo para gerenciar variáveis de ambiente e configurações
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigModule acessível em toda a aplicação sem precisar importá-lo em cada módulo
    }),

    // TypeOrmModule: Configuração do TypeORM para conexão com o banco de dados
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa o ConfigModule para acessar variáveis de ambiente
      inject: [ConfigService], // Injeta o ConfigService para acessar as configurações
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Define o tipo do banco de dados como PostgreSQL
        url: configService.get<string>('DATABASE_URL'), // Obtém a string de conexão do banco de dados a partir das variáveis de ambiente
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Define o caminho para as entidades do TypeORM
        synchronize: true, // Desativa a sincronização automática do esquema (recomendado para produção)
        migrations: [__dirname + '/migrations/*{.ts,.js}'], // Define o caminho para as migrations
      }),
    }),

    // Importa o módulo de usuários
    UsersModule,

    // Importa o módulo de times
    TeamsModule,

    PlayersModule,

    LineupModule,

    GamesModule,

    MatchesModule,

    MatchStatsModule,
  ],
})
export class AppModule {}