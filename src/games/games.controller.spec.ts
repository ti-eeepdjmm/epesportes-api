import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';

describe('GamesController', () => {
  let controller: GamesController;
  let service: GamesService;
  let repository: Repository<Game>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockResolvedValue({ id: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        GamesService,
        { provide: getRepositoryToken(Game), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    service = module.get<GamesService>(GamesService);
    repository = module.get<Repository<Game>>(getRepositoryToken(Game));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an empty array when no games exist', async () => {
    expect(await controller.findAll()).toEqual([]);
  });
});
