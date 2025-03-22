import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { NotificationType } from '../schemas/notification.entity';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
