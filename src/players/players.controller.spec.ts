/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;
  const Player = {
    id: 1,
    user: {
      id: 1,
      name: 'User A',
      email: 'user@example.com',
      password: 'hashedpassword',
      profilePhoto: 'http://example.com/photo.jpg',
      favoriteTeam: {
        id: 2,
        name: 'Team A',
        logo: 'logo.png',
        createdAt: new Date(),
      },
      isAthlete: true,
      birthDate: new Date(),
      createdAt: new Date(),
    },
    team: {
      id: 2,
      name: 'Team A',
      logo: 'logo.png',
      createdAt: new Date(),
    },
    game: {
      id: 2,
      name: 'Futsal',
      description: 'Jogo de futsal',
      rules: 'Regras do futsal',
      created_at: new Date(),
    },
    position: 'Atacante',
    jerseyNumber: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a player', async () => {
      const createPlayerDto: CreatePlayerDto = {
        userId: 1,
        teamId: 2,
        gameId: 2,
        position: 'Atacante',
        jerseyNumber: 10,
      };
      const result = Player;
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createPlayerDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createPlayerDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of players', async () => {
      const result: Player[] = [Player, Player, Player];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single player', async () => {
      const result = Player;

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a player', async () => {
      const updatePlayerDto: UpdatePlayerDto = {
        position: 'Goleiro',
        jerseyNumber: 1,
      };
      const result = Player;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updatePlayerDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, updatePlayerDto);
    });
  });

  describe('remove', () => {
    it('should remove a player', async () => {
      const result = undefined;

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
