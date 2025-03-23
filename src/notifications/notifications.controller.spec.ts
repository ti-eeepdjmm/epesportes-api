import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationType } from './schemas/notification.entity';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  const mockNotification = {
    _id: '123',
    user_id: 'user1',
    type: NotificationType.GAME,
    reference: '456',
    date: new Date(),
    read: false,
  };

  const mockNotificationsService = {
    create: jest.fn().mockResolvedValue(mockNotification),
    findAll: jest.fn().mockResolvedValue([mockNotification]),
    findOne: jest.fn().mockResolvedValue(mockNotification),
    update: jest.fn().mockResolvedValue(mockNotification),
    remove: jest.fn().mockResolvedValue(mockNotification),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const createNotificationDto: CreateNotificationDto = {
        user_id: 'user1',
        type: NotificationType.GAME,
        reference: '456',
        read: false,
      };
      const createSpy = jest.spyOn(service, 'create');
      const result = await controller.create(createNotificationDto);
      expect(result).toEqual(mockNotification);
      expect(createSpy).toHaveBeenCalledWith(createNotificationDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of notifications', async () => {
      const findAllSpy = jest.spyOn(service, 'findAll');
      const result = await controller.findAll();
      expect(result).toEqual([mockNotification]);
      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a notification', async () => {
      const id = '123';
      const findOneSpy = jest.spyOn(service, 'findOne');
      const result = await controller.findOne(id);
      expect(result).toEqual(mockNotification);
      expect(findOneSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a notification', async () => {
      const id = '123';
      const updateNotificationDto: UpdateNotificationDto = { read: true };
      const updateSpy = jest.spyOn(service, 'update');
      const result = await controller.update(id, updateNotificationDto);
      expect(result).toEqual(mockNotification);
      expect(updateSpy).toHaveBeenCalledWith(id, updateNotificationDto);
    });
  });

  describe('remove', () => {
    it('should remove a notification', async () => {
      const id = '123';
      const removeSpy = jest.spyOn(service, 'remove');
      const result = await controller.remove(id);
      expect(result).toEqual(mockNotification);
      expect(removeSpy).toHaveBeenCalledWith(id);
    });
  });
});
