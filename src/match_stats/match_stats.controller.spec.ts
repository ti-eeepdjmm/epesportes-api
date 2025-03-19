import { Test, TestingModule } from '@nestjs/testing';
import { MatchStatsController } from './match_stats.controller';
import { MatchStatsService } from './match_stats.service';

describe('MatchStatsController', () => {
  let controller: MatchStatsController;
  let service: MatchStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchStatsController],
      providers: [
        {
          provide: MatchStatsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue([{ id: 1, goals: 2 }]),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MatchStatsController>(MatchStatsController);
    service = module.get<MatchStatsService>(MatchStatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all match stats', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, goals: 2 }]);
    expect(service.findAll).toHaveBeenCalled();
  });
});
