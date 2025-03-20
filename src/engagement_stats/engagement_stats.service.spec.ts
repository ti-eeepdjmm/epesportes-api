/* eslint-disable @typescript-eslint/no-unused-vars */

import { Test, TestingModule } from '@nestjs/testing';
import { EngagementStatsService } from './engagement_stats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EngagementStat } from './entities/engagement_stat.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { mockEngagementStats, mockEngagementStat } from '../../test/mocks';

describe('EngagementStatsService', () => {
  let service: EngagementStatsService;
  let engagementStatRepository: Repository<EngagementStat>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue(mockEngagementStats),
      findOne: jest.fn().mockResolvedValue(mockEngagementStat),
      save: jest
        .fn()
        .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EngagementStatsService,
        {
          provide: getRepositoryToken(EngagementStat),
          useValue: mockRepository,
        },
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<EngagementStatsService>(EngagementStatsService);
    engagementStatRepository = module.get<Repository<EngagementStat>>(
      getRepositoryToken(EngagementStat),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all engagement stats', async () => {
    expect(await service.findAll()).toEqual(mockEngagementStats);
  });
});
