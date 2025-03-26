import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Game } from '../games/entities/game.entity';
import { Team } from '../teams/entities/team.entity';
import { AppGateway } from '../app-gateway/app/app.gateway';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { NotificationsService } from '../notifications/notifications.service';

const notificationsService = {
  create: jest.fn(),
} as unknown as NotificationsService;

describe('MatchesService', () => {
  let service: MatchesService;

  let matchRepository: jest.Mocked<Repository<Match>>;
  let gameRepository: jest.Mocked<Repository<Game>>;
  let teamRepository: jest.Mocked<Repository<Team>>;
  let appGateway: { emitMatchUpdate: jest.Mock };

  beforeEach(async () => {
    matchRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<Match>>;

    gameRepository = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<Game>>;

    teamRepository = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<Team>>;

    appGateway = {
      emitMatchUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: getRepositoryToken(Match), useValue: matchRepository },
        { provide: getRepositoryToken(Game), useValue: gameRepository },
        { provide: getRepositoryToken(Team), useValue: teamRepository },
        { provide: AppGateway, useValue: appGateway },
        { provide: NotificationsService, useValue: notificationsService },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    jest.clearAllMocks();
  });

  const mockGame: Game = { id: 1, name: 'Futebol' } as Game;
  const mockTeam1: Team = { id: 10, name: 'Time A', logo: 'logoA.png' } as Team;
  const mockTeam2: Team = { id: 20, name: 'Time B', logo: 'logoB.png' } as Team;

  describe('create', () => {
    it('should create and return a match', async () => {
      const dto: CreateMatchDto = {
        gameId: 1,
        team1Id: 10,
        team2Id: 20,
        score_team1: 0,
        score_team2: 0,
        status: 'scheduled',
        dateTime: new Date(),
      };

      gameRepository.findOne.mockResolvedValue(mockGame);
      teamRepository.findOne
        .mockResolvedValueOnce(mockTeam1)
        .mockResolvedValueOnce(mockTeam2);

      const createdMatch = {
        ...dto,
        game: mockGame,
        team1: mockTeam1,
        team2: mockTeam2,
        id: 1,
      } as Match;

      matchRepository.create.mockReturnValue(createdMatch);
      matchRepository.save.mockResolvedValue(createdMatch);

      const result = await service.create(dto);

      expect(appGateway.emitMatchUpdate).toHaveBeenCalled();
      expect(result).toEqual(createdMatch);
    });

    it('should throw if game not found', async () => {
      gameRepository.findOne.mockResolvedValue(null);

      const dto = { gameId: 1 } as CreateMatchDto;

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw if team1 not found', async () => {
      gameRepository.findOne.mockResolvedValue(mockGame);
      teamRepository.findOne.mockResolvedValueOnce(null);

      const dto = { gameId: 1, team1Id: 10 } as CreateMatchDto;

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw if team2 not found', async () => {
      gameRepository.findOne.mockResolvedValue(mockGame);
      teamRepository.findOne
        .mockResolvedValueOnce(mockTeam1)
        .mockResolvedValueOnce(null);

      const dto = { gameId: 1, team1Id: 10, team2Id: 20 } as CreateMatchDto;

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all matches', async () => {
      const matches: Match[] = [{ id: 1 } as Match, { id: 2 } as Match];
      matchRepository.find.mockResolvedValue(matches);

      const result = await service.findAll();
      expect(result).toEqual(matches);
    });
  });

  describe('findOne', () => {
    it('should return a match by id', async () => {
      const match = { id: 1 } as Match;
      matchRepository.findOne.mockResolvedValue(match);

      const result = await service.findOne(1);
      expect(result).toEqual(match);
    });

    it('should throw if not found', async () => {
      matchRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(123)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and emit events if needed', async () => {
      const matchBefore: Match = {
        id: 1,
        score_team1: 0,
        score_team2: 0,
        status: 'ongoing',
        team1: mockTeam1,
        team2: mockTeam2,
      } as Match;

      const dto: UpdateMatchDto = {
        score_team1: 1,
        status: 'ongoing',
      };

      const matchAfter: Match = { ...matchBefore, ...dto };

      matchRepository.findOne.mockResolvedValue(matchBefore);
      matchRepository.save.mockResolvedValue(matchAfter);

      const result = await service.update(1, dto);

      expect(appGateway.emitMatchUpdate).toHaveBeenCalled();
      expect(result).toEqual(matchAfter);
    });
  });

  describe('remove', () => {
    it('should remove successfully', async () => {
      matchRepository.delete.mockResolvedValue({ affected: 1, raw: {} });
      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw if not found', async () => {
      matchRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
