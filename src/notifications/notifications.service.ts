import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

type NotificationQuery = {
  recipientId: number;
  read?: boolean;
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const createdNotification = new this.notificationModel(
      createNotificationDto,
    );
    return createdNotification.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    return notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const updatedNotification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();
    if (!updatedNotification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    return updatedNotification;
  }

  async remove(id: string): Promise<Notification> {
    const deletedNotification = await this.notificationModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedNotification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    return deletedNotification;
  }

  // ✅ Buscar por usuário (com filtro opcional de lidas)
  async findByRecipient(
    recipientId: number,
    read?: boolean,
  ): Promise<Notification[]> {
    const query: NotificationQuery = { recipientId };
    if (read !== undefined) query.read = read;
    return this.notificationModel.find(query).sort({ date: -1 }).exec();
  }

  // ✅ Marcar todas como lidas
  async markAllAsRead(recipientId: number): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { recipientId, read: false },
      { $set: { read: true } },
    );
    return { modifiedCount: result.modifiedCount };
  }
}
