import { Test, TestingModule } from '@nestjs/testing';
import { TimelinePostsService } from './timeline_posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TimelinePost } from './schemas/timeline_post.schema';
import { AppGateway } from '../app-gateway/app/app.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
import { Types } from 'mongoose';

describe('TimelinePostsService', () => {
  let service: TimelinePostsService;

  const mockObjectId = new Types.ObjectId();

  const savedPostMock = {
    _id: mockObjectId,
    userId: 1,
    content: 'Post',
    media: [],
    reactions: {
      liked: [],
      beast: [],
      plays_great: [],
      amazing_goal: [],
      stylish: [],
    },
    comments: [],
    postDate: new Date(),
    __v: 0,
  };

  const mockSave = jest.fn().mockResolvedValue(savedPostMock);

  const MockTimelinePostModel = jest.fn().mockImplementation(() => ({
    ...savedPostMock,
    save: mockSave,
  }));

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const mockGateway = {
    emitNewPost: jest.fn(),
    emitNotification: jest.fn(),
    emitTimelineUpdate: jest.fn(),
  };

  const mockNotificationsService = {
    create: jest.fn(),
  };

  const mockPostModel = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimelinePostsService,
        {
          provide: getModelToken(TimelinePost.name),
          useValue: Object.assign(MockTimelinePostModel, mockPostModel),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: AppGateway,
          useValue: mockGateway,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<TimelinePostsService>(TimelinePostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all posts', async () => {
    mockPostModel.exec.mockResolvedValueOnce([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
    expect(mockPostModel.find).toHaveBeenCalled();
  });

  it('should return one post', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockPostModel.findById.mockReturnValueOnce({
      exec: () => Promise.resolve({ _id: id }),
    });

    const result = await service.findOne(id);
    expect(result).toEqual({ _id: id });
  });

  it('should remove a post', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockPostModel.findByIdAndDelete.mockReturnValueOnce({
      exec: () => Promise.resolve({ deleted: true }),
    });

    const result = await service.remove(id);
    expect(result).toEqual({ deleted: true });
  });

  it('should create a post and emit socket + notification', async () => {
    const dto = {
      userId: 1,
      content: 'Post',
      media: [],
      reactions: {
        liked: [],
        beast: [],
        plays_great: [],
        amazing_goal: [],
        stylish: [],
      },
      comments: [],
    };

    const result = await service.create(dto); // cast para evitar exigência de campos adicionais

    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(savedPostMock);
    expect(mockGateway.emitNewPost).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: mockObjectId.toString(),
        userId: 1,
        content: 'Post',
      }),
    );
    expect(mockNotificationsService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Novo post',
        link: `timeline-posts/${mockObjectId.toString()}`,
      }),
    );
  });
});
