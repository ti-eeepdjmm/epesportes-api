import { TimelinePostsController } from './timeline_posts.controller';
import { TimelinePostsService } from './timeline_posts.service';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { UpdateTimelinePostDto } from './dto/update-timeline_post.dto';
import { mockTimelinePost, mockTimelinePosts } from '../../test/mocks';

// Mock do schema para evitar que o construtor real (que estende Document) seja executado
jest.mock('./schemas/timeline_post.schema', () => {
  class TimelinePostMock {
    constructor(data: any) {
      Object.assign(this, data);
    }
  }
  return { TimelinePost: TimelinePostMock };
});

import { TimelinePost } from './schemas/timeline_post.schema';

describe('TimelinePostsController', () => {
  let controller: TimelinePostsController;
  let service: TimelinePostsService;
  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    service = mockService as unknown as TimelinePostsService;
    controller = new TimelinePostsController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all timeline posts', async () => {
    const timelinePosts = mockTimelinePosts.map(
      (post) => new TimelinePost(post),
    );
    jest.spyOn(service, 'findAll').mockResolvedValue(timelinePosts);
    await expect(controller.findAll()).resolves.toEqual(timelinePosts);
  });

  it('should return a single post', async () => {
    const timelinePostInstance = new TimelinePost(mockTimelinePost);
    jest.spyOn(service, 'findOne').mockResolvedValue(timelinePostInstance);
    const validId = '507f1f77bcf86cd799439011';
    await expect(controller.findOne(validId)).resolves.toEqual(
      timelinePostInstance,
    );
  });

  it('should create a new post', async () => {
    const dto: CreateTimelinePostDto = {
      userId: 'user123',
      content: 'Test post',
    };
    const timelinePostInstance = new TimelinePost(mockTimelinePost);
    jest.spyOn(service, 'create').mockResolvedValue(timelinePostInstance);
    await expect(controller.create(dto)).resolves.toEqual(timelinePostInstance);
  });

  it('should update a post', async () => {
    const dto: UpdateTimelinePostDto = { content: 'Updated content' };
    const timelinePostInstance = new TimelinePost(mockTimelinePost);
    jest.spyOn(service, 'update').mockResolvedValue(timelinePostInstance);
    const validId = '507f1f77bcf86cd799439011';
    await expect(controller.update(validId, dto)).resolves.toEqual(
      timelinePostInstance,
    );
  });

  it('should delete a post', async () => {
    const timelinePostInstance = new TimelinePost(mockTimelinePost);
    jest.spyOn(service, 'remove').mockResolvedValue(timelinePostInstance);
    const validId = '507f1f77bcf86cd799439011';
    await expect(controller.remove(validId)).resolves.toEqual(
      timelinePostInstance,
    );
  });
});
