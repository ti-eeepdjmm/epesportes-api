/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TimelinePostsController } from './timeline_posts.controller';
import { TimelinePostsService } from './timeline_posts.service';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { UpdateTimelinePostDto } from './dto/update-timeline_post.dto';

describe('TimelinePostsController', () => {
  let controller: TimelinePostsController;
  let service: TimelinePostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimelinePostsController],
      providers: [
        {
          provide: TimelinePostsService,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            findAllPaginated: jest.fn().mockResolvedValue({
              data: [],
              total: 0,
              page: 1,
              limit: 10,
            }),
            findOne: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<TimelinePostsController>(TimelinePostsController);
    service = module.get<TimelinePostsService>(TimelinePostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a post', async () => {
    const dto: CreateTimelinePostDto = { userId: 1, content: 'Post' };
    await expect(controller.create(dto)).resolves.toEqual({});
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return paginated posts', async () => {
    await expect(
      controller.findAllPaginated('1', '10', undefined),
    ).resolves.toEqual({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });
    expect(service.findAllPaginated).toHaveBeenCalledWith(1, 10, undefined);
  });

  it('should return one post', async () => {
    await expect(controller.findOne('abc123')).resolves.toEqual({});
    expect(service.findOne).toHaveBeenCalledWith('abc123');
  });

  it('should update a post', async () => {
    const dto: UpdateTimelinePostDto = { content: 'Updated' };
    await expect(controller.update('abc123', dto)).resolves.toEqual({});
    expect(service.update).toHaveBeenCalledWith('abc123', dto);
  });

  it('should remove a post', async () => {
    await expect(controller.remove('abc123')).resolves.toEqual({});
    expect(service.remove).toHaveBeenCalledWith('abc123');
  });
});
