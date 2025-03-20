import { Test, TestingModule } from '@nestjs/testing';
import { TeamStandingsController } from './team_standings.controller';
import { TeamStandingsService } from './team_standings.service';
import { mockTeamStandings, mockTeamStanding } from '../../test/mocks';

describe('TeamStandingsController', () => {
  let controller: TeamStandingsController;
  let service: TeamStandingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamStandingsController],
      providers: [
        {
          provide: TeamStandingsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue(mockTeamStandings),
            findOne: jest.fn().mockResolvedValue(mockTeamStanding),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeamStandingsController>(TeamStandingsController);
    service = module.get<TeamStandingsService>(TeamStandingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all team standings', async () => {
    expect(await controller.findAll()).toEqual(mockTeamStandings);
    expect(service.findAll).toHaveBeenCalled();
  });
});
