import { Test, TestingModule } from '@nestjs/testing';
import { LineupController } from './lineup.controller';
import { LineupService } from './lineup.service';

describe('LineupController', () => {
  let controller: LineupController;
  let service: LineupService;
  const mockLineups = [
    {
      id: 1,
      team: { id: 1, nome: 'Time A', logo: 'time_a.png' },
      match: { id: 1, game: { id: 1, nome: 'Futebol' } },
      player: { id: 10, nome: 'Jogador 1', posicao: 'Atacante', numero_camisa: 9 },
      titular: true,
    },
    {
      id: 2,
      team: { id: 2, nome: 'Time B', logo: 'time_b.png' },
      match: { id: 1, game: { id: 1, nome: 'Futebol' } },
      player: { id: 20, nome: 'Jogador 2', posicao: 'Goleiro', numero_camisa: 1 },
      titular: false,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineupController],
      providers: [
        {
          provide: LineupService,
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

    controller = module.get<LineupController>(LineupController);
    service = module.get<LineupService>(LineupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll and return data', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue(mockLineups as any);

    expect(await controller.findAll()).toEqual(mockLineups);
    expect(service.findAll).toHaveBeenCalled();
  });
});