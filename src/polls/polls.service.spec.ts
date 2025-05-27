/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PollsService } from './polls.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AppGateway } from '../app-gateway/app/app.gateway';

const mockPoll = {
  _id: '123',
  userId: 1,
  question: 'Test?',
  options: [
    { option: 'Red', userVotes: [] },
    { option: 'Blue', userVotes: [] },
  ],
  expiration: new Date(),
};

class PollModelFake {
  constructor(private data: unknown) {
    Object.assign(this, data);
  }

  save() {
    return Promise.resolve(mockPoll);
  }

  static find() {
    return { exec: jest.fn().mockResolvedValue([mockPoll]) };
  }

  static sort() {
    return { exec: jest.fn().mockResolvedValue([mockPoll]) };
  }

  static findById(id: string) {
    return { exec: jest.fn().mockResolvedValue(mockPoll) };
  }

  static findByIdAndUpdate(id: string, update: unknown, options: unknown) {
    return { exec: jest.fn().mockResolvedValue(mockPoll) };
  }

  static findByIdAndDelete(id: string) {
    return { exec: jest.fn().mockResolvedValue(mockPoll) };
  }
}
const notificationsService = {
  create: jest.fn(),
} as unknown as NotificationsService;

describe('PollsService', () => {
  let service: PollsService;
  let appGateway: {
    emitPollUpdate: jest.Mock;
    emitGlobalNotification: jest.Mock;
  };

  appGateway = {
    emitPollUpdate: jest.fn(),
    emitGlobalNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: getModelToken('Poll'),
          useValue: PollModelFake,
        },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: AppGateway, useValue: appGateway },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);
  });

  it('should create a poll', async () => {
    const dto = {
      userId: 1,
      question: 'What is your favorite color?',
      options: [{ option: 'Red' }, { option: 'Blue' }],
      expiration: new Date(),
    };
    const result = await service.create(dto);
    expect(result).toEqual(mockPoll);
  });

  it('should return all polls', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockPoll]);
  });

  it('should return one poll', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const result = await service.findOne(validId);
    expect(result).toEqual(mockPoll);
  });

  it('should update a poll', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const dto = { question: 'Updated question?' };
    const result = await service.update(validId, dto);
    expect(result).toEqual(mockPoll);
  });

  it('should delete a poll', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const result = await service.remove(validId);
    expect(result).toEqual(mockPoll);
  });
});
