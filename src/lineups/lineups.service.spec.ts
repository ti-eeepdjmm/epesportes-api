/* eslint-disable @typescript-eslint/no-unused-vars */

import { Test, TestingModule } from '@nestjs/testing';
import { LineupsService } from './lineups.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lineup } from './entities/lineup.entity';
import { Match } from '../matches/entities/match.entity';
import { Player } from '../players/entities/player.entity';
import { Team } from '../teams/entities/team.entity';
import { Repository } from 'typeorm';

describe('LineupService', () => {
  let service: LineupsService;
  let lineupRepository: Repository<Lineup>;
  let matchRepository: Repository<Match>;
  let playerRepository: Repository<Player>;
  let teamRepository: Repository<Team>;
  const mockLineup = {
    id: 1,
    team: { id: 1, nome: 'Time A' },
    match: { id: 1, game: { id: 1, nome: 'Futebol' } },
    player: {
      id: 10,
      nome: 'Jogador 1',
      posicao: 'Atacante',
      numero_camisa: 9,
    },
    titular: true,
  };

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      find: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineupsService,
        { provide: getRepositoryToken(Lineup), useValue: mockRepository },
        { provide: getRepositoryToken(Match), useValue: mockRepository },
        { provide: getRepositoryToken(Player), useValue: mockRepository },
        { provide: getRepositoryToken(Team), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<LineupsService>(LineupsService);
    lineupRepository = module.get<Repository<Lineup>>(
      getRepositoryToken(Lineup),
    );
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all lineups', async () => {
    const mockLineup = {
      id: 1,
      team: { id: 1, nome: 'Time A' },
      titular: true,
    };
    jest.spyOn(lineupRepository, 'find').mockResolvedValue([mockLineup as any]);

    expect(await service.findAll()).toEqual([mockLineup]);
  });
});
