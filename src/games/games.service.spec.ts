import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';

describe('GamesService', () => {
  let service: GamesService;
  let repository: Repository<Game>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn().mockImplementation((dto) => dto as Game),
      save: jest.fn().mockResolvedValue({ id: 1, ...CreateGameDto }),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    repository = module.get<Repository<Game>>(getRepositoryToken(Game));
  });

  it('should create a game', async () => {
    const gameDto = {
      nome: 'Futebol',
      descricao: 'Jogo de bola',
      regras: 'Regras padrão',
    };
    const savedGame = { id: 1, ...gameDto };

    jest.spyOn(repository, 'save').mockResolvedValue(savedGame as Game);

    expect(await service.create(gameDto)).toEqual(savedGame);
  });
});
