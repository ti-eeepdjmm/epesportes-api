/* eslint-disable @typescript-eslint/no-unused-vars */

import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Game } from '../games/entities/game.entity';
import { Team } from '../teams/entities/team.entity';
import { Repository } from 'typeorm';

describe('MatchesService', () => {
  let service: MatchesService;
  let matchRepository: Repository<Match>;
  let gameRepository: Repository<Game>;
  let teamRepository: Repository<Team>;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      find: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: getRepositoryToken(Match), useValue: mockRepository },
        { provide: getRepositoryToken(Game), useValue: mockRepository },
        { provide: getRepositoryToken(Team), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all matches', async () => {
    const mockMatch = {
      id: 1,
      score_team1: 2,
      score_team2: 1,
      status: 'finalizada',
    };
    jest.spyOn(matchRepository, 'find').mockResolvedValue([mockMatch as any]);

    expect(await service.findAll()).toEqual([mockMatch]);
  });
});
