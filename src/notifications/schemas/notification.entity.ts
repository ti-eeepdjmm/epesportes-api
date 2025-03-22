import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  REACTION = 'reaction',
  COMMENT = 'comment',
  GAME = 'game',
  POLL = 'poll',
}

@Schema({ timestamps: { createdAt: 'date', updatedAt: false } })
export class Notification {
  // O campo _id é gerado automaticamente pelo Mongoose (pode ser considerado como uuid)
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true })
  reference: string;

  // 'date' será definido automaticamente como o timestamp de criação
  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
