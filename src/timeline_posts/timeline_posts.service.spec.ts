/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TimelinePostsService } from './timeline_posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TimelinePost } from './schemas/timeline_post.schema';
import { Model, Types } from 'mongoose';
import { AppGateway } from '../app-gateway/app/app.gateway';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { UpdateTimelinePostDto } from './dto/update-timeline_post.dto';
import { NotFoundException } from '@nestjs/common';
import { Team } from '../teams/entities/team.entity';
import { NotificationsService } from '../notifications/notifications.service';

const mockTeam: Team = {
  id: 1,
  name: 'Epesportes FC',
  logo: 'https://example.com/logos/epesportes-fc.png',
  createdAt: new Date('2024-01-10T14:00:00Z'),
  // Adicione outros campos do Team se houver
};

const mockUser: User = {
  id: 1,
  name: 'Carlos Souza',
  authUserId: 'b5298cda-4a9d-4b94-90d1-5c129f5e99a2',
  profilePhoto: 'https://example.com/profiles/carlos.png',
  favoriteTeam: mockTeam,
  isAthlete: true,
  birthDate: new Date('2002-06-15'),
  createdAt: new Date('2025-03-25T10:30:00Z'),
};

const notificationsService = {
  create: jest.fn(),
} as unknown as NotificationsService;

describe('TimelinePostsService', () => {
  let service: TimelinePostsService;
  let timelinePostModel: jest.Mocked<Model<TimelinePost>>;
  let userRepository: jest.Mocked<Repository<User>>;

  const appGateway = {
    emitNewPost: jest.fn(),
    emitNotification: jest.fn(),
    emitMatchUpdate: jest.fn(),
    emitPollUpdate: jest.fn(),
    emitGlobalNotification: jest.fn(),
    afterInit: jest.fn(),
    handleConnection: jest.fn(),
    handleDisconnect: jest.fn(),
    logger: {
      log: jest.fn(),
      error: jest.fn(),
    },
    server: {
      emit: jest.fn(),
      to: jest.fn().mockReturnValue({ emit: jest.fn() }),
    },
  } as unknown as AppGateway;

  const mockObjectId = new Types.ObjectId().toHexString();

  beforeEach(async () => {
    timelinePostModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    } as unknown as jest.Mocked<Model<TimelinePost>>;

    userRepository = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimelinePostsService,
        {
          provide: getModelToken(TimelinePost.name),
          useValue: timelinePostModel,
        },
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: AppGateway, useValue: appGateway as unknown as AppGateway },
        { provide: NotificationsService, useValue: notificationsService },
      ],
    }).compile();

    service = module.get<TimelinePostsService>(TimelinePostsService);
  });

  describe('create', () => {
    it('should create a new post and emit event', async () => {
      const dto: CreateTimelinePostDto = {
        userId: 2,
        content: 'Post!',
      };

      const mockSave = jest.fn().mockResolvedValue({
        _id: mockObjectId,
        userId: dto.userId,
        content: dto.content,
      } as TimelinePost);

      const mockPost = {
        _id: mockObjectId,
        userId: dto.userId,
        content: dto.content,
        save: mockSave,
      } as unknown as TimelinePost;

      const mockModel = jest.fn(
        () => mockPost,
      ) as unknown as Model<TimelinePost>;

      const customService = new TimelinePostsService(
        mockModel,
        userRepository,
        appGateway,
        notificationsService, // ← novo argumento
      );

      const result = await customService.create(dto);

      expect(appGateway.emitNewPost).toHaveBeenCalledWith(
        expect.objectContaining({
          author: dto.userId,
          postId: expect.any(String),
        }),
      );

      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({ _id: mockObjectId, userId: dto.userId }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const posts: TimelinePost[] = [
        {
          _id: mockObjectId,
          content: 'Exemplo',
          userId: 2,
        } as unknown as TimelinePost,
      ];

      timelinePostModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(posts),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const post = {
        _id: mockObjectId,
        content: 'Test',
        userId: 2,
      } as unknown as TimelinePost;

      timelinePostModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(post),
      } as any);

      const result = await service.findOne(mockObjectId);
      expect(result).toEqual(post);
    });

    it('should throw if invalid ObjectId', async () => {
      await expect(service.findOne('123')).rejects.toThrow(
        'Invalid ObjectId format',
      );
    });
  });

  describe('update', () => {
    it('should emit comment notification on new comment', async () => {
      const id = mockObjectId;
      const postBefore = {
        _id: id,
        userId: 2,
        comments: [],
        reactions: {},
      } as unknown as TimelinePost;

      const updateDto: UpdateTimelinePostDto = {
        comments: [{ userId: 4, content: 'Comentário!' }],
      };

      timelinePostModel.findById.mockResolvedValue(postBefore);

      timelinePostModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...postBefore,
          ...updateDto,
        } as TimelinePost),
      } as any);

      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.update(id, updateDto);

      expect(appGateway.emitNotification).toHaveBeenCalledWith(
        2,
        expect.objectContaining({ type: 'comment' }),
      );

      expect(result?.comments?.length).toBe(1);
    });

    it('should emit reaction notification on new reaction', async () => {
      const id = mockObjectId;
      const postBefore = {
        _id: id,
        userId: 2,
        comments: [],
        reactions: { liked: [2, 1] },
      } as unknown as TimelinePost;

      const updateDto: UpdateTimelinePostDto = {
        reactions: { liked: [2, 3, 1] },
      };

      timelinePostModel.findById.mockResolvedValue(postBefore);

      timelinePostModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...postBefore,
          ...updateDto,
        } as TimelinePost),
      } as any);

      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.update(id, updateDto);

      expect(appGateway.emitNotification).toHaveBeenCalledWith(
        2,
        expect.objectContaining({ type: 'reaction' }),
      );

      expect(result?.reactions?.liked).toContain(2);
    });

    it('should throw NotFoundException if post not found', async () => {
      timelinePostModel.findById.mockResolvedValue(null);

      await expect(
        service.update(mockObjectId, {} as UpdateTimelinePostDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if ObjectId is invalid', async () => {
      await expect(
        service.update('invalid-id', {} as UpdateTimelinePostDto),
      ).rejects.toThrow('Invalid ObjectId format');
    });
  });

  describe('remove', () => {
    it('should delete the post', async () => {
      const deleted = { _id: mockObjectId } as TimelinePost;

      timelinePostModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deleted),
      } as any);

      const result = await service.remove(mockObjectId);
      expect(result).toEqual(deleted);
    });

    it('should throw if ObjectId is invalid', async () => {
      await expect(service.remove('bad')).rejects.toThrow(
        'Invalid ObjectId format',
      );
    });
  });
});
