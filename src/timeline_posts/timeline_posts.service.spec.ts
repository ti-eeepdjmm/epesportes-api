import { Test, TestingModule } from '@nestjs/testing';
import { TimelinePostsService } from './timeline_posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { TimelinePost } from './schemas/timeline_posts.schema';
import { Model } from 'mongoose';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { mockTimelinePost } from '../../test/mocks';

describe('TimelinePostsService', () => {
  let service: TimelinePostsService;
  let model: Model<TimelinePost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimelinePostsService,
        {
          provide: getModelToken(TimelinePost.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockTimelinePost),
            find: jest.fn().mockResolvedValue([mockTimelinePost]),
            findById: jest.fn().mockResolvedValue(mockTimelinePost),
            findByIdAndDelete: jest.fn().mockResolvedValue(mockTimelinePost),
          },
        },
      ],
    }).compile();

    service = module.get<TimelinePostsService>(TimelinePostsService);
    model = module.get<Model<TimelinePost>>(getModelToken(TimelinePost.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    const dto: CreateTimelinePostDto = {
      userId: 'user123',
      content: 'Test post',
    };
    expect(await service.create(dto)).toEqual(mockTimelinePost);
  });

  it('should return all posts', async () => {
    expect(await service.findAll()).toEqual([mockTimelinePost]);
  });

  it('should return one post by id', async () => {
    expect(await service.findOne('1')).toEqual(mockTimelinePost);
  });

  it('should delete a post', async () => {
    expect(await service.remove('1')).toEqual(mockTimelinePost);
  });
});
