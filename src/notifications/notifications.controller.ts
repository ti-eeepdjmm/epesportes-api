import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './schemas/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.remove(id);
  }

  // ✅ Buscar notificações por usuário, com filtro por read (opcional)
  @Get('user/:recipientId')
  async findByRecipient(
    @Param('recipientId') recipientId: string,
    @Query('read') read?: string,
  ): Promise<Notification[]> {
    const readFilter = read !== undefined ? read === 'true' : undefined;
    return this.notificationsService.findByRecipient(
      Number(recipientId),
      readFilter,
    );
  }

  // ✅ Marcar todas como lidas
  @Patch('user/:recipientId/mark-all-read')
  async markAllAsRead(
    @Param('recipientId') recipientId: string,
  ): Promise<{ modifiedCount: number }> {
    return this.notificationsService.markAllAsRead(Number(recipientId));
  }
}
