/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EngagementStatsController } from './engagement_stats.controller';
import { EngagementStatsService } from './engagement_stats.service';
import { mockEngagementStats, mockEngagementStat } from '../../test/mocks';

describe('EngagementStatsController', () => {
  let controller: EngagementStatsController;
  let service: EngagementStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EngagementStatsController],
      providers: [
        {
          provide: EngagementStatsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue(mockEngagementStats),
            findOne: jest.fn().mockResolvedValue(mockEngagementStat),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EngagementStatsController>(
      EngagementStatsController,
    );
    service = module.get<EngagementStatsService>(EngagementStatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all engagement stats', async () => {
    expect(await controller.findAll()).toEqual(mockEngagementStats);
    expect(service.findAll).toHaveBeenCalled();
  });
});
