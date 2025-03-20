import { Test, TestingModule } from '@nestjs/testing';
import { MatchStatsService } from './match_stats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MatchStat } from './entities/match_stat.entity';
import { Match } from '../matches/entities/match.entity';
import { Team } from '../teams/entities/team.entity';
import { Repository } from 'typeorm';

describe('MatchStatsService', () => {
  let service: MatchStatsService;
  let matchStatsRepository: Repository<MatchStat>;
  let matchRepository: Repository<Match>;
  let teamRepository: Repository<Team>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      save: jest
        .fn()
        .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchStatsService,
        { provide: getRepositoryToken(MatchStat), useValue: mockRepository },
        { provide: getRepositoryToken(Match), useValue: mockRepository }, // Adicionado
        { provide: getRepositoryToken(Team), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<MatchStatsService>(MatchStatsService);
    matchStatsRepository = module.get<Repository<MatchStat>>(
      getRepositoryToken(MatchStat),
    );
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match)); // Adicionado
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all match stats', async () => {
    const mockStats = {
      id: 1,
      match: { id: 1, game: { id: 1, name: 'Football' } }, // Relacionamento com Match
      team: { id: 1, name: 'Team A' }, // Relacionamento com Team
      goals: 2,
      playersGoals: { 'Player 1': 1, 'Player 2': 1 }, // JSONB
      fouls: 5,
      shots: 10,
      penalties: 1,
      possession: 60,
    };

    jest
      .spyOn(matchStatsRepository, 'find')
      .mockResolvedValue([mockStats as any]);

    expect(await service.findAll()).toEqual([mockStats]);
  });
});
