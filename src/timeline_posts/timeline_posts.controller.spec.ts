import { Test, TestingModule } from '@nestjs/testing';
import { TimelinePostsController } from './timeline_posts.controller';
import { TimelinePostsService } from './timeline_posts.service';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { mockTimelinePost } from '../../test/mocks';

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
            create: jest.fn().mockResolvedValue(mockTimelinePost),
            findAll: jest.fn().mockResolvedValue([mockTimelinePost]),
            findOne: jest.fn().mockResolvedValue(mockTimelinePost),
            remove: jest.fn().mockResolvedValue(mockTimelinePost),
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

  it('should return all timeline posts', async () => {
    expect(await controller.findAll()).toEqual([mockTimelinePost]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single post', async () => {
    expect(await controller.findOne('1')).toEqual(mockTimelinePost);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a new post', async () => {
    const dto: CreateTimelinePostDto = {
      userId: 'user123',
      content: 'Test post',
    };
    expect(await controller.create(dto)).toEqual(mockTimelinePost);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should delete a post', async () => {
    expect(await controller.remove('1')).toEqual(mockTimelinePost);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
