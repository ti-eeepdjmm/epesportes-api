import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class TimelinePost extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  media: string[];

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({
    type: [{ userId: String, content: String }],
    default: [],
  })
  comments: { userId: string; content: string }[];
}

export const TimelinePostSchema = SchemaFactory.createForClass(TimelinePost);