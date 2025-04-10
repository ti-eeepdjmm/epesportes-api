/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { User } from '../users/entities/user.entity';
import { Team } from '../teams/entities/team.entity';
import { Game } from '../games/entities/game.entity';

describe('PlayersService', () => {
  let service: PlayersService;
  let playerRepository: Repository<Player>;
  let userRepository: Repository<User>;
  let teamRepository: Repository<Team>;
  let gameRepository: Repository<Game>;

  const team = { id: 1, name: 'Team A', logo: 'logo.png' } as Team;
  const game = { id: 1, name: 'Futsal', rules: 'Rules' } as Game;
  const user = { id: 1, name: 'John Doe' } as User;
  const player = {
    id: 1,
    user,
    team,
    game,
    position: 'Goleiro',
    jerseyNumber: 1,
  } as Player;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getRepositoryToken(Player),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Team),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Game),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    playerRepository = module.get(getRepositoryToken(Player));
    userRepository = module.get(getRepositoryToken(User));
    teamRepository = module.get(getRepositoryToken(Team));
    gameRepository = module.get(getRepositoryToken(Game));
  });

  describe('create', () => {
    it('should create a player', async () => {
      const dto = {
        userId: user.id,
        teamId: team.id,
        gameId: game.id,
        position: 'Goleiro',
        jerseyNumber: 1,
      };

      jest.spyOn(teamRepository, 'findOneBy').mockResolvedValue(team);
      jest.spyOn(gameRepository, 'findOneBy').mockResolvedValue(game);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(playerRepository, 'create').mockReturnValue(player);
      jest.spyOn(playerRepository, 'save').mockResolvedValue(player);

      const result = await service.create(dto);
      expect(result).toEqual(player);
      expect(teamRepository.findOneBy).toHaveBeenCalledWith({ id: dto.teamId });
      expect(gameRepository.findOneBy).toHaveBeenCalledWith({ id: dto.gameId });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: dto.userId });
      expect(playerRepository.create).toHaveBeenCalledWith({
        user,
        team,
        game,
        position: dto.position,
        jerseyNumber: dto.jerseyNumber,
      });
      expect(playerRepository.save).toHaveBeenCalledWith(player);
    });

    it('should return error when team or game is null', async () => {
      const dto = {
        userId: 99,
        teamId: 99,
        gameId: 99,
        position: 'Atacante',
        jerseyNumber: 9,
      };

      jest.spyOn(teamRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(gameRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(
        'Erro not found(team | game | user)!',
      );
    });
  });

  describe('findAll', () => {
    it('should return all players', async () => {
      const result = [player];
      jest.spyOn(playerRepository, 'find').mockResolvedValue(result);
      expect(await service.findAll()).toEqual(result);
      expect(playerRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'team', 'game'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a player by id', async () => {
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(player);
      const result = await service.findOne(player.id);
      expect(result).toEqual(player);
      expect(playerRepository.findOne).toHaveBeenCalledWith({
        where: { id: player.id },
        relations: ['user', 'team', 'game'],
      });
    });

    it('should return null if player not found', async () => {
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update player with team and user', async () => {
      const dto = { teamId: team.id, userId: user.id, position: 'Zagueiro' };

      jest.spyOn(service, 'findOne').mockResolvedValue({ ...player } as Player);
      jest.spyOn(teamRepository, 'findOneBy').mockResolvedValue(team);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(playerRepository, 'save').mockResolvedValue({
        ...player,
        ...dto,
      });

      const result = await service.update(player.id, dto);
      expect(result).toEqual({ ...player, ...dto });
    });

    it('should return null if player not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      const result = await service.update(999, { position: 'Meio Campo' });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a player if exists', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(player);
      jest.spyOn(playerRepository, 'remove').mockResolvedValue(player);
      await service.remove(player.id);
      expect(playerRepository.remove).toHaveBeenCalledWith(player);
    });

    it('should not call remove if player does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      const spy = jest.spyOn(playerRepository, 'remove');
      await service.remove(999);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
