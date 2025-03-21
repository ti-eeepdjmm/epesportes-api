/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

export const mockRanking = {
  id: 1,
  player: { id: 1, name: 'Player 1' },
  goals: 5,
  assists: 2,
  yellowCards: 1,
  redCards: 0,
};

export const mockRankings = [mockRanking];

describe('RankingsController', () => {
  let controller: RankingsController;
  let service: RankingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingsController],
      providers: [
        {
          provide: RankingsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue(mockRankings),
            findOne: jest.fn().mockResolvedValue(mockRanking),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RankingsController>(RankingsController);
    service = module.get<RankingsService>(RankingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all rankings', async () => {
    expect(await controller.findAll()).toEqual(mockRankings);
    expect(service.findAll).toHaveBeenCalled();
  });
});
