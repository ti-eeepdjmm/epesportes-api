/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { MentionsController } from './mentions.controller';
import { MentionsService } from './mentions.service';
import { CreateMentionDto } from './dto/create-mention.dto';
import { UpdateMentionDto } from './dto/update-mention.dto';

describe('MentionsController', () => {
  let controller: MentionsController;
  let service: MentionsService;

  const mockMentionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentionsController],
      providers: [
        {
          provide: MentionsService,
          useValue: mockMentionsService,
        },
      ],
    }).compile();

    controller = module.get<MentionsController>(MentionsController);
    service = module.get<MentionsService>(MentionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call MentionsService.create and return the result', async () => {
      const dto: CreateMentionDto = {
        postId: 'asadsasdas',
        commentId: 2,
        mentionedUserId: 1,
        mentionedPlayerId: 1,
        senderUserId: 2,
      };
      const result = { id: 1, ...dto };
      mockMentionsService.create.mockResolvedValue(result);
      expect(await controller.create(dto)).toEqual(result);
      expect(mockMentionsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call MentionsService.findAll and return the result', async () => {
      const result = [{ id: 1 }, { id: 2 }];
      mockMentionsService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
      expect(mockMentionsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call MentionsService.findOne and return the result', async () => {
      const result = { id: 1 };
      mockMentionsService.findOne.mockResolvedValue(result);
      expect(await controller.findOne('1')).toEqual(result);
      expect(mockMentionsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call MentionsService.update and return the result', async () => {
      const updateDto: UpdateMentionDto = { postId: 'asdasdd' };
      const result = { id: 1, postId: 10 };
      mockMentionsService.update.mockResolvedValue(result);
      expect(await controller.update('1', updateDto)).toEqual(result);
      expect(mockMentionsService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should call MentionsService.remove and return the result', async () => {
      const result = { id: 1 };
      mockMentionsService.remove.mockResolvedValue(result);
      expect(await controller.remove('1')).toEqual(result);
      expect(mockMentionsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
