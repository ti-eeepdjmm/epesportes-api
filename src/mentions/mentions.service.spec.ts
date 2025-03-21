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
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockPlayerRepository = {
    findOneBy: jest.fn(),
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
      const dto = {
        postId: 1,
        commentId: 2,
        mentionedUserId: 10,
        mentionedPlayerId: null,
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

  describe('update', () => {
    it('should update basic fields and associations', async () => {
      const existingMention = {
        id: 1,
        postId: 1,
        commentId: 2,
        mentionedUser: { id: 1 },
        mentionedPlayer: { id: 2 },
      };
      const updatedMention = {
        ...existingMention,
        postId: 10,
        commentId: 20,
        mentionedUser: { id: 3, name: 'New User' },
        mentionedPlayer: { id: 4, name: 'New Player' },
      };

      // findOne retorna a menção existente
      mockMentionRepository.findOne.mockResolvedValue(existingMention);
      // Busca o novo usuário e jogador
      mockUserRepository.findOneBy.mockResolvedValue({
        id: 3,
        name: 'New User',
      });
      mockPlayerRepository.findOneBy.mockResolvedValue({
        id: 4,
        name: 'New Player',
      });
      mockMentionRepository.save.mockResolvedValue(updatedMention);

      const updateDto = {
        postId: 10,
        commentId: 20,
        mentionedUserId: 3,
        mentionedPlayerId: 4,
      };

      const result = await service.update(1, updateDto as any);
      expect(result).toEqual(updatedMention);
      expect(existingMention.postId).toEqual(10);
      expect(existingMention.commentId).toEqual(20);
      expect(existingMention.mentionedUser).toEqual({
        id: 3,
        name: 'New User',
      });
      expect(existingMention.mentionedPlayer).toEqual({
        id: 4,
        name: 'New Player',
      });
    });

    it('should remove mentionedPlayer when mentionedPlayerId is null', async () => {
      const existingMention = {
        id: 1,
        postId: 1,
        commentId: 2,
        mentionedUser: { id: 1 },
        mentionedPlayer: { id: 2 },
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
      };
      mockMentionRepository.findOne.mockResolvedValue(existingMention);
      mockPlayerRepository.findOneBy.mockResolvedValue(null);

      const updateDto = { mentionedPlayerId: 99 };
      await expect(service.update(1, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
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
});
