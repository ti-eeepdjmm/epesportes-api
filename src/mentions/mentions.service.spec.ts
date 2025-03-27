/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { MentionsService } from './mentions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mention } from './entities/mention.entity';
import { User } from '../users/entities/user.entity';
import { Player } from '../players/entities/player.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateMentionDto } from './dto/create-mention.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { AppGateway } from '../app-gateway/app/app.gateway';
import { UpdateMentionDto } from './dto/update-mention.dto';
import { NotificationType } from '../notifications/schemas/notification.entity';

describe('MentionsService', () => {
  let service: MentionsService;
  let mentionRepository: Repository<Mention>;
  let userRepository: Repository<User>;
  let playerRepository: Repository<Player>;

  const mockMentionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    findUserOrFail: jest.fn(),
    findPlayerIfExists: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockPlayerRepository = {
    findOneBy: jest.fn(),
  };

  const mockNotificationsService = {
    create: jest.fn(),
  };

  const mockAppGateway = {
    emitNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MentionsService,
        {
          provide: getRepositoryToken(Mention),
          useValue: mockMentionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Player),
          useValue: mockPlayerRepository,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: AppGateway,
          useValue: mockAppGateway,
        },
      ],
    }).compile();

    service = module.get<MentionsService>(MentionsService);
    mentionRepository = module.get<Repository<Mention>>(
      getRepositoryToken(Mention),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw NotFoundException if mentioned user is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      const dto: CreateMentionDto = {
        postId: '231',
        commentId: 2,
        mentionedUserId: 10,
        senderUserId: 2,
        mentionedPlayerId: 10,
      };
      await expect(service.create(dto as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create a mention with player when mentionedPlayerId is provided', async () => {
      const fakeUser = { id: 1, name: 'Test User' };
      const fakePlayer = { id: 2, name: 'Test Player' };
      const fakeMention = {
        id: 100,
        postId: 1,
        commentId: 2,
        mentionedUser: fakeUser,
        mentionedPlayer: fakePlayer,
        senderUserId: 2,
      };

      mockUserRepository.findOneBy.mockResolvedValue(fakeUser);
      mockPlayerRepository.findOneBy.mockResolvedValue(fakePlayer);
      mockMentionRepository.create.mockReturnValue(fakeMention);
      mockMentionRepository.save.mockResolvedValue(fakeMention);

      const dto = {
        postId: 1,
        commentId: 2,
        mentionedUserId: 1,
        mentionedPlayerId: 2,
      };
      const result = await service.create(dto as any);
      expect(result).toEqual(fakeMention);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: dto.mentionedUserId,
      });
      expect(mockPlayerRepository.findOneBy).toHaveBeenCalledWith({
        id: dto.mentionedPlayerId,
      });
    });

    it('should create a mention without player when mentionedPlayerId is null', async () => {
      const fakeUser = { id: 1, name: 'Test User' };
      const fakeMention = {
        id: 101,
        postId: 1,
        commentId: 2,
        mentionedUser: fakeUser,
        mentionedPlayer: null,
      };

      mockUserRepository.findOneBy.mockResolvedValue(fakeUser);
      // Se mentionedPlayerId for null, não busca o player
      mockMentionRepository.create.mockReturnValue(fakeMention);
      mockMentionRepository.save.mockResolvedValue(fakeMention);

      const dto = {
        postId: 1,
        commentId: 2,
        mentionedUserId: 1,
        mentionedPlayerId: null,
      };
      const result = await service.create(dto as any);
      expect(result).toEqual(fakeMention);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: dto.mentionedUserId,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of mentions', async () => {
      const mentions = [{ id: 1 }, { id: 2 }];
      mockMentionRepository.find.mockResolvedValue(mentions);
      const result = await service.findAll();
      expect(result).toEqual(mentions);
    });
  });

  describe('findOne', () => {
    it('should return a mention if found', async () => {
      const mention = { id: 1 };
      mockMentionRepository.findOne.mockResolvedValue(mention);
      const result = await service.findOne(1);
      expect(result).toEqual(mention);
    });

    it('should throw NotFoundException if mention is not found', async () => {
      mockMentionRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  it('should remove mentionedPlayer when mentionedPlayerId is null', async () => {
    const existingMention = {
      id: 1,
      postId: '23424',
      commentId: 2,
      mentionedUser: { id: 2 },
      mentionedPlayer: { id: 2 },
      senderUser: { id: 1 },
    };
    const updatedMention = { ...existingMention, mentionedPlayer: null };

    mockMentionRepository.findOne.mockResolvedValue(existingMention);
    // Se o valor for explicitamente null, não é feita a busca de player
    mockMentionRepository.save.mockResolvedValue(updatedMention);

    const updateDto = { mentionedPlayerId: null };
    const result = await service.update(1, updateDto as any);
    expect(result.mentionedPlayer).toBeNull();
  });

  it('should throw NotFoundException if new mentionedUserId is not found', async () => {
    const existingMention = {
      id: 1,
      postId: 1,
      commentId: 2,
      mentionedUser: { id: 1 },
      mentionedPlayer: null,
      senderUser: 4,
    };
    mockMentionRepository.findOne.mockResolvedValue(existingMention);
    mockUserRepository.findOneBy.mockResolvedValue(null);

    const updateDto = { mentionedUserId: 99 };
    await expect(service.update(1, updateDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if new mentionedPlayerId is not found', async () => {
    const existingMention = {
      id: 1,
      postId: 1,
      commentId: 2,
      mentionedUser: { id: 1 },
      mentionedPlayer: { id: 2 },
      senderUser: 4,
    };
    mockMentionRepository.findOne.mockResolvedValue(existingMention);
    mockPlayerRepository.findOneBy.mockResolvedValue(null);

    const updateDto = { mentionedPlayerId: 99 };
    await expect(service.update(1, updateDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  describe('remove', () => {
    it('should remove a mention', async () => {
      const existingMention = { id: 1 };
      mockMentionRepository.findOne.mockResolvedValue(existingMention);
      mockMentionRepository.remove.mockResolvedValue(existingMention);
      const result = await service.remove(1);
      expect(result).toEqual(existingMention);
    });
  });

  it('should update basic fields, emit notification and save changes', async () => {
    const mockMention = {
      id: 1,
      postId: 'old-post',
      commentId: 20,
      mentionedUser: { id: 2 },
      mentionedPlayer: null,
      senderUser: {
        id: 3,
        name: 'João',
        profilePhoto: 'foto.png',
      },
    } as Mention;

    const dto: UpdateMentionDto = {
      postId: 'updated-post',
      commentId: 25,
      mentionedUserId: 2,
      mentionedPlayerId: 5,
    };

    const updatedMention = {
      ...mockMention,
      postId: dto.postId,
      commentId: dto.commentId,
      mentionedPlayer: { id: 5 },
    } as Mention;

    jest.spyOn(service, 'findOne').mockResolvedValue(mockMention);
    jest.spyOn(service as any, 'findUserOrFail').mockResolvedValue({ id: 2 });
    jest
      .spyOn(service as any, 'findPlayerIfExists')
      .mockResolvedValue({ id: 5 });
    mockMentionRepository.save.mockResolvedValue(updatedMention);

    const result = await service.update(1, dto);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect((service as any).findUserOrFail).toHaveBeenCalledWith(2);
    expect((service as any).findPlayerIfExists).toHaveBeenCalledWith(5);

    expect(mockMentionRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        postId: dto.postId,
        commentId: dto.commentId,
        mentionedUser: { id: 2 },
        mentionedPlayer: { id: 5 },
      }),
    );

    expect(mockNotificationsService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: NotificationType.MENTION,
        message: 'Você foi mencionado (atualizado)!',
        link: `posts/${dto.postId}`,
        senderId: 3,
        recipientId: 2,
      }),
    );

    expect(mockAppGateway.emitNotification).toHaveBeenCalledWith(
      2,
      expect.objectContaining({
        message: expect.stringContaining('João'),
        type: 'mention',
        sender: {
          id: 3,
          name: 'João',
          avatar: 'foto.png',
        },
      }),
    );

    expect(result).toEqual(updatedMention);
  });
});
