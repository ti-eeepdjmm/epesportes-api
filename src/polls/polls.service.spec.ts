/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PollsService } from './polls.service';

const mockPoll = {
  _id: '123',
  userId: 'user1',
  question: 'What is your favorite color?',
  options: [
    { option: 'Red', votes: 10 },
    { option: 'Blue', votes: 5 },
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

describe('PollsService', () => {
  let service: PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: getModelToken('Poll'),
          useValue: PollModelFake,
        },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);
  });

  it('should create a poll', async () => {
    const dto = {
      userId: 'user123',
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
