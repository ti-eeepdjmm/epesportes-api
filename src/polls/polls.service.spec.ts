import { Test, TestingModule } from '@nestjs/testing';
import { PollsService } from './polls.service';
import { getModelToken } from '@nestjs/mongoose';
import { AppGateway } from '../app-gateway/app/app.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { Poll } from './schemas/poll.schema';

describe('PollsService', () => {
  let service: PollsService;

  // Mock do documento de enquete (simula o retorno de new this.pollModel().save())
  const mockPollDoc = {
    id: '123',
    userId: 44,
    question: 'Qual seu esporte favorito?',
    options: [
      {
        value: 'futsal',
        type: 'text',
        userVotes: [],
      },
    ],
    expiration: new Date(Date.now() + 3600000),
    totalVotes: 0,
    save: jest.fn(),
  };

  // Mock do model Mongoose (simula o construtor new this.pollModel(dto))
  const mockPollModelConstructor = jest.fn(() => mockPollDoc);

  // Mock do AppGateway
  const mockAppGateway = {
    emitGlobalNotification: jest.fn(),
    emitPollUpdate: jest.fn(),
  };

  // Mock do NotificationsService
  const mockNotificationsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: getModelToken(Poll.name),
          useValue: Object.assign(mockPollModelConstructor, {
            // mocks de métodos do model, se necessário
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          }),
        },
        {
          provide: AppGateway,
          useValue: mockAppGateway,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);

    // Define o valor resolvido pelo método save()
    mockPollDoc.save.mockResolvedValue(mockPollDoc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('deve criar uma enquete, emitir notificação e retornar a enquete criada', async () => {
      const dto = {
        userId: 44,
        question: 'Qual seu esporte favorito?',
        options: [
          {
            value: 'futsal', // pode ser "futsal", "userId:44", "teamId:12", etc.
            type: 'text', // obrigatório: "text", "user" ou "team"
          },
        ],
        expiration: new Date(Date.now() + 3600000),
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await service.create(dto as any);

      expect(mockPollModelConstructor).toHaveBeenCalledWith(dto);
      expect(mockPollDoc.save).toHaveBeenCalled();

      expect(mockNotificationsService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'poll',
          message: 'Nova enquete criada',
          link: 'polls/123',
        }),
      );

      expect(mockAppGateway.emitGlobalNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: dto.question,
          type: 'poll',
          link: 'polls/123',
        }),
      );

      expect(result).toEqual(mockPollDoc);
    });
  });
});
