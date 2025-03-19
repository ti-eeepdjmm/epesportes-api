import { Test, TestingModule } from '@nestjs/testing';
import { RankingsService } from './rankings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';
import { Player } from '../players/entities/player.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export const mockRanking = {
  id: 1,
  player: { id: 1, name: 'Player 1' },
  goals: 5,
  assists: 2,
  yellowCards: 1,
  redCards: 0,
};

export const mockRankings = [mockRanking];

describe('RankingsService', () => {
  let service: RankingsService;
  let rankingRepository: Repository<Ranking>;
  let playerRepository: Repository<Player>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue(mockRankings),
      findOne: jest.fn().mockResolvedValue(mockRanking),
      save: jest.fn().mockImplementation(dto => Promise.resolve({ id: 1, ...dto })),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingsService,
        { provide: getRepositoryToken(Ranking), useValue: mockRepository },
        { provide: getRepositoryToken(Player), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<RankingsService>(RankingsService);
    rankingRepository = module.get<Repository<Ranking>>(getRepositoryToken(Ranking));
    playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all rankings', async () => {
    expect(await service.findAll()).toEqual(mockRankings);
  });
});