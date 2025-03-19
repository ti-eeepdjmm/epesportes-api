import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { User } from '../users/entities/user.entity';
import { Team } from '../teams/entities/team.entity';
import { NotFoundException } from '@nestjs/common';

describe('PlayersService', () => {
  let service: PlayersService;
  let playerRepository: Repository<Player>;
  let userRepository: Repository<User>;
  let teamRepository: Repository<Team>;

  // Objetos globais para serem usados nos testes
  const team = { id: 2, name: 'Team A', logo: 'logo.png', createdAt: new Date() };
  const user = { 
    id: 1, 
    name: 'User A', 
    email: 'user@example.com', 
    password: 'hashedpassword',
    profilePhoto: 'profile.png',
    favoriteTeam: team,
    isAthlete: true,
    birthDate: new Date(),
    createdAt: new Date(), 
};
  const player = {
    id: 1,
    user,
    team,
    position: 'Atacante',
    jerseyNumber: 10,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Team),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a player', async () => {
      const createPlayerDto = {
        userId: user.id,
        teamId: team.id,
        position: 'Atacante',
        jerseyNumber: 10,
      };

      jest.spyOn(teamRepository, 'findOneBy').mockResolvedValue(team);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(playerRepository, 'create').mockReturnValue(player as Player);
      jest.spyOn(playerRepository, 'save').mockResolvedValue(player as Player);

      const result = await service.create(createPlayerDto);

      expect(result).toBe(player);
      expect(teamRepository.findOneBy).toHaveBeenCalledWith({ id: createPlayerDto.teamId });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: createPlayerDto.userId });
      expect(playerRepository.create).toHaveBeenCalledWith({
        user,
        team,
        position: createPlayerDto.position,
        jerseyNumber: createPlayerDto.jerseyNumber,
      });
      expect(playerRepository.save).toHaveBeenCalledWith(player);
    });

    it('should throw NotFoundException if team is not found', async () => {
      const createPlayerDto = {
        userId: user.id,
        teamId: team.id,
        position: 'Atacante',
        jerseyNumber: 10,
      };

      jest.spyOn(teamRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.create(createPlayerDto)).rejects.toThrow(
        new NotFoundException(`Team with ID ${createPlayerDto.teamId} not found`),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of players', async () => {
      const players = [player, player];

      jest.spyOn(playerRepository, 'find').mockResolvedValue(players as Player[]);

      const result = await service.findAll();

      expect(result).toBe(players);
      expect(playerRepository.find).toHaveBeenCalledWith({ relations: ['user', 'team'] });
    });
  });

  describe('findOne', () => {
    it('should return a player by ID', async () => {
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(player as Player);

      const result = await service.findOne(player.id);

      expect(result).toBe(player);
      expect(playerRepository.findOne).toHaveBeenCalledWith({
        where: { id: player.id },
        relations: ['user', 'team'],
      });
    });

    it('should throw NotFoundException if player is not found', async () => {
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(player.id)).rejects.toThrow(
        new NotFoundException(`Player with ID ${player.id} not found`),
      );
    });
  });

  describe('update', () => {
    it('should update a player', async () => {
      const updatePlayerDto = { position: 'Goleiro', jerseyNumber: 1 };

      jest.spyOn(service, 'findOne').mockResolvedValue(player as Player);
      jest.spyOn(playerRepository, 'save').mockResolvedValue({
        ...player,
        ...updatePlayerDto,
      } as Player);

      const result = await service.update(player.id, updatePlayerDto);

      expect(result).toEqual({ ...player, ...updatePlayerDto });
      expect(service.findOne).toHaveBeenCalledWith(player.id);
      expect(playerRepository.save).toHaveBeenCalledWith({ ...player, ...updatePlayerDto });
    });
  });

  describe('remove', () => {
    it('should remove a player', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(player as Player);
      jest.spyOn(playerRepository, 'remove').mockResolvedValue(player as Player);

      await service.remove(player.id);

      expect(service.findOne).toHaveBeenCalledWith(player.id);
      expect(playerRepository.remove).toHaveBeenCalledWith(player);
    });
  });
});