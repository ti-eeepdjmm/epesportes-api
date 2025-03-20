import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Subesquema para Reações
@Schema({ _id: false }) // Evita criar um _id automático para este subdocumento
class Reactions {
  @Prop({ type: [String], default: [] }) liked: string[];
  @Prop({ type: [String], default: [] }) beast: string[];
  @Prop({ type: [String], default: [] }) plays_great: string[];
  @Prop({ type: [String], default: [] }) amazing_goal: string[];
  @Prop({ type: [String], default: [] }) stylish: string[];
}
const ReactionsSchema = SchemaFactory.createForClass(Reactions);

// Subesquema para Comentários
@Schema({ _id: false })
class Comment {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) content: string;
  @Prop({ type: Date, default: Date.now }) commentDate: Date;
}
const CommentSchema = SchemaFactory.createForClass(Comment);

// Esquema Principal para TimelinePost
@Schema({ timestamps: { createdAt: 'postDate', updatedAt: false } })
export class TimelinePost extends Document {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) content: string;
  @Prop({ type: [String], default: [] }) media: string[];
  @Prop({ type: ReactionsSchema, default: {} }) reactions: Reactions;
  @Prop({ type: [CommentSchema], default: [] }) comments: Comment[];
}

// Criação do Schema
export const TimelinePostSchema = SchemaFactory.createForClass(TimelinePost);
