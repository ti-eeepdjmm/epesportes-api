import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Subesquema para Reações
@Schema({ _id: false }) // Evita criar um _id automático para este subdocumento
class Reactions {
  @Prop({ type: [Number], default: [] }) liked: number[];
  @Prop({ type: [Number], default: [] }) beast: number[];
  @Prop({ type: [Number], default: [] }) plays_great: number[];
  @Prop({ type: [Number], default: [] }) amazing_goal: number[];
  @Prop({ type: [Number], default: [] }) stylish: number[];
}
export const ReactionsSchema = SchemaFactory.createForClass(Reactions);

// Subesquema para Comentários
@Schema({ _id: false })
class Comment {
  @Prop({ required: true }) userId: number;
  @Prop({ required: true }) content: string;
  @Prop({ type: Date, default: Date.now }) commentDate: Date;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);

// Esquema Principal para TimelinePost
@Schema({ timestamps: { createdAt: 'postDate', updatedAt: false } })
export class TimelinePost extends Document {
  @Prop({ required: true }) userId: number;
  @Prop({ required: true }) content: string;
  @Prop({ type: [String], default: [] }) media: string[];
  @Prop({ type: ReactionsSchema, default: {} }) reactions: Reactions;
  @Prop({ type: [CommentSchema], default: [] }) comments: Comment[];
}

// Criação do Schema
export const TimelinePostSchema = SchemaFactory.createForClass(TimelinePost);
