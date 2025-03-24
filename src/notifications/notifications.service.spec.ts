/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './schemas/notification.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

const mockNotification: NotificationDocument = {
  _id: '123',
  user_id: 'user1',
  type: NotificationType.GAME,
  reference: '456',
  date: new Date(),
  read: false,
} as unknown as NotificationDocument;

class NotificationModelFake {
  constructor(private data: unknown) {
    Object.assign(this, data);
  }

  save() {
    return Promise.resolve(mockNotification);
  }

  static find() {
    return { exec: jest.fn().mockResolvedValue([mockNotification]) };
  }

  static findById(id: string) {
    return { exec: jest.fn().mockResolvedValue(mockNotification) };
  }

  static findByIdAndUpdate(id: string, update: unknown, options: unknown) {
    return { exec: jest.fn().mockResolvedValue(mockNotification) };
  }

  static findByIdAndDelete(id: string) {
    return { exec: jest.fn().mockResolvedValue(mockNotification) };
  }
}

describe('NotificationsService', () => {
  let service: NotificationsService;
  let model: typeof NotificationModelFake;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getModelToken(Notification.name),
          useValue: NotificationModelFake,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    model = module.get(getModelToken(Notification.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const dto: CreateNotificationDto = {
        user_id: 'user1',
        type: NotificationType.GAME,
        reference: '456',
        read: false,
      };
      const result = await service.create(dto);
      expect(result).toEqual(mockNotification);
    });
  });

  describe('findAll', () => {
    it('should return an array of notifications', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockNotification]);
    });
  });

  describe('findOne', () => {
    it('should return a notification if found', async () => {
      const result = await service.findOne('123');
      expect(result).toEqual(mockNotification);
    });

    it('should throw NotFoundException if notification not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.findOne('999')).rejects.toThrow(
        new NotFoundException('Notification with id 999 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a notification', async () => {
      const dto: UpdateNotificationDto = { read: true };
      const result = await service.update('123', dto);
      expect(result).toEqual(mockNotification);
    });

    it('should throw NotFoundException if notification not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(
        service.update('999', {} as UpdateNotificationDto),
      ).rejects.toThrow(
        new NotFoundException('Notification with id 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a notification', async () => {
      const result = await service.remove('123');
      expect(result).toEqual(mockNotification);
    });

    it('should throw NotFoundException if notification not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.remove('999')).rejects.toThrow(
        new NotFoundException('Notification with id 999 not found'),
      );
    });
  });
});
