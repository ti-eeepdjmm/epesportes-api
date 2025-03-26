import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDate,
} from 'class-validator';
import { NotificationType } from '../schemas/notification.entity';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  recipientId?: number;

  @IsNotEmpty()
  @IsNumber()
  senderId?: number;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  link: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;
}
