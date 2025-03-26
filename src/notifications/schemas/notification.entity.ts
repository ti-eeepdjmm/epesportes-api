import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  REACTION = 'reaction',
  COMMENT = 'comment',
  MATCH = 'match',
  POLL = 'poll',
  POST = 'post',
}

@Schema({ timestamps: { createdAt: false, updatedAt: false } })
export class Notification {
  @Prop({ required: false })
  recipientId: number;

  @Prop({ required: false })
  senderId: number;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: false })
  isGlobal: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
