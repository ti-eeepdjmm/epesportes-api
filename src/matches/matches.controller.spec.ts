/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

describe('MatchesController', () => {
  let controller: MatchesController;
  let service: MatchesService;
  const mockMatches = [
    {
      id: 1,
      game: {
        id: 1,
        nome: 'Futebol',
        descricao: 'Jogo de bola',
        regras: 'Regras padrão',
      },
      team1: { id: 1, nome: 'Time A', logo: 'time_a.png' },
      team2: { id: 2, nome: 'Time B', logo: 'time_b.png' },
      score_team1: 2,
      score_team2: 1,
      status: 'finalizada',
      data_hora: new Date().toISOString(),
    },
    {
      id: 2,
      game: {
        id: 2,
        nome: 'Basquete',
        descricao: 'Jogo com cestas',
        regras: 'Regras oficiais',
      },
      team1: { id: 3, nome: 'Time C', logo: 'time_c.png' },
      team2: { id: 4, nome: 'Time D', logo: 'time_d.png' },
      score_team1: 89,
      score_team2: 92,
      status: 'em andamento',
      data_hora: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        {
          provide: MatchesService,
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

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll and return data', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue(mockMatches as any);

    expect(await controller.findAll()).toEqual(mockMatches);
    expect(service.findAll).toHaveBeenCalled();
  });
});
