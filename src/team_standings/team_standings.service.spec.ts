import { Test, TestingModule } from '@nestjs/testing';
import { TeamStandingsService } from './team_standings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeamStanding } from './entities/team_standing.entity';
import { Team } from '../teams/entities/team.entity';
import { Repository } from 'typeorm';
import { mockTeamStandings, mockTeamStanding } from '../../test/mocks';



describe('TeamStandingsService', () => {
  let service: TeamStandingsService;
  let teamStandingRepository: Repository<TeamStanding>;
  let teamRepository: Repository<Team>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue(mockTeamStandings),
      findOne: jest.fn().mockResolvedValue(mockTeamStanding),
      save: jest.fn().mockImplementation(dto => Promise.resolve({ id: 1, ...dto })),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamStandingsService,
        { provide: getRepositoryToken(TeamStanding), useValue: mockRepository },
        { provide: getRepositoryToken(Team), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TeamStandingsService>(TeamStandingsService);
    teamStandingRepository = module.get<Repository<TeamStanding>>(getRepositoryToken(TeamStanding));
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all team standings', async () => {
    expect(await service.findAll()).toEqual(mockTeamStandings);
  });
});
