/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TimelinePostsService } from './timeline_posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { mockTimelinePost } from '../../test/mocks';
import { AppGateway } from '../app-gateway/app/app.gateway';

class TimelinePostModelFake {
  constructor(private data: any) {
    Object.assign(this, data);
  }

  save() {
    return Promise.resolve(mockTimelinePost);
  }

  static find() {
    return { exec: jest.fn().mockResolvedValue([mockTimelinePost]) };
  }

  static findById(id: string) {
    return { exec: jest.fn().mockResolvedValue(mockTimelinePost) };
  }

  static findByIdAndUpdate(id: string, update: any, options: any) {
    return { exec: jest.fn().mockResolvedValue(mockTimelinePost) };
  }

  static findByIdAndDelete(id: string) {
    return { exec: jest.fn().mockResolvedValue(mockTimelinePost) };
  }
}

describe('TimelinePostsService', () => {
  let service: TimelinePostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimelinePostsService,
        {
          provide: getModelToken('TimelinePost'),
          useValue: TimelinePostModelFake,
        },
        AppGateway,
        {
          provide: AppGateway,
          useValue: {
            server: {
              emit: jest.fn(), // simula a função emit do WebSocket
            },
            emitNewPost: jest.fn(function (this: any, payload) {
              this.server.emit('feed:new-post', payload);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TimelinePostsService>(TimelinePostsService);
  });

  it('should create a post', async () => {
    const dto = { userId: 'user123', content: 'Test post' };
    const result = await service.create(dto);
    expect(result).toEqual(mockTimelinePost);
  });

  it('should return all posts', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockTimelinePost]);
  });

  it('should return one post', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const result = await service.findOne(validId);
    expect(result).toEqual(mockTimelinePost);
  });

  it('should update a post', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const dto = { content: 'Updated content' };
    const result = await service.update(validId, dto);
    expect(result).toEqual(mockTimelinePost);
  });

  it('should delete a post', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const result = await service.remove(validId);
    expect(result).toEqual(mockTimelinePost);
  });
});
