import { Test, TestingModule } from '@nestjs/testing';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';

describe('PollsController', () => {
  let controller: PollsController;
  let service: PollsService;

  const mockPoll = {
    _id: '123',
    userId: 'user1',
    question: 'What is your favorite color?',
    options: [
      { option: 'Red', votes: 10 },
      { option: 'Blue', votes: 5 },
    ],
    expiration: new Date(),
  };

  const mockPollsService = {
    create: jest.fn().mockResolvedValue(mockPoll),
    findAll: jest.fn().mockResolvedValue([mockPoll]),
    findOne: jest.fn().mockResolvedValue(mockPoll),
    update: jest.fn().mockResolvedValue(mockPoll),
    remove: jest.fn().mockResolvedValue(mockPoll),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsController],
      providers: [{ provide: PollsService, useValue: mockPollsService }],
    }).compile();

    controller = module.get<PollsController>(PollsController);
    service = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a poll', async () => {
      const createPollDto: CreatePollDto = {
        userId: 2,
        question: 'What is your favorite color?',
        options: [{ option: 'Red' }, { option: 'Blue' }],
        expiration: new Date(),
      };
      // Utilizando spy para obter o método vinculado
      const createSpy = jest.spyOn(service, 'create');
      const result = await controller.create(createPollDto);
      expect(result).toEqual(mockPoll);
      expect(createSpy).toHaveBeenCalledWith(createPollDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of polls', async () => {
      const findAllSpy = jest.spyOn(service, 'findAll');
      const result = await controller.findAll();
      expect(result).toEqual([mockPoll]);
      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a poll', async () => {
      const id = '123';
      const findOneSpy = jest.spyOn(service, 'findOne');
      const result = await controller.findOne(id);
      expect(result).toEqual(mockPoll);
      expect(findOneSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a poll', async () => {
      const id = '123';
      const updatePollDto: UpdatePollDto = { question: 'Updated question?' };
      const updateSpy = jest.spyOn(service, 'update');
      const result = await controller.update(id, updatePollDto);
      expect(result).toEqual(mockPoll);
      expect(updateSpy).toHaveBeenCalledWith(id, updatePollDto);
    });
  });

  describe('remove', () => {
    it('should remove a poll', async () => {
      const id = '123';
      const removeSpy = jest.spyOn(service, 'remove');
      const result = await controller.remove(id);
      expect(result).toEqual(mockPoll);
      expect(removeSpy).toHaveBeenCalledWith(id);
    });
  });
});
