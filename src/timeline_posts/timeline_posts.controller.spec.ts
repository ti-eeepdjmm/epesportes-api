import { TimelinePostsController } from './timeline_posts.controller';
import { TimelinePostsService } from './timeline_posts.service';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { UpdateTimelinePostDto } from './dto/update-timeline_post.dto';
import { mockTimelinePost, mockTimelinePosts } from '../../test/mocks';
import { TimelinePost } from './schemas/timeline_posts.schema';

jest.mock('./timeline_posts.service');
const timelinePosts = mockTimelinePosts.map((post) => new TimelinePost(post));

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
    jest.spyOn(service, 'findAll').mockResolvedValue(timelinePosts);
    await expect(controller.findAll()).resolves.toEqual(mockTimelinePost);
  });

  it('should return a single post', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(new TimelinePost(mockTimelinePost));
    await expect(controller.findOne('1')).resolves.toEqual(mockTimelinePost);
  });

  it('should create a new post', async () => {
    const dto: CreateTimelinePostDto = {
      userId: 'user123',
      content: 'Test post',
    };
    jest
      .spyOn(service, 'create')
      .mockResolvedValue(new TimelinePost(mockTimelinePost));
    await expect(controller.create(dto)).resolves.toEqual(mockTimelinePost);
  });

  it('should update a post', async () => {
    const dto: UpdateTimelinePostDto = { content: 'Updated content' };
    jest
      .spyOn(service, 'update')
      .mockResolvedValue(new TimelinePost(mockTimelinePost));
    await expect(controller.update('1', dto)).resolves.toEqual(
      mockTimelinePost,
    );
  });

  it('should delete a post', async () => {
    jest
      .spyOn(service, 'remove')
      .mockResolvedValue(new TimelinePost(mockTimelinePost));
    await expect(controller.remove('1')).resolves.toEqual(mockTimelinePost);
  });
});
