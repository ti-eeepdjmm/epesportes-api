import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PollOptionType = 'text' | 'user' | 'team';

@Schema({ _id: false })
class PollOption {
  @Prop({ required: true, enum: ['text', 'user', 'team'] })
  type: PollOptionType;

  @Prop({ required: true })
  value: string; // texto direto, userId ou teamId (como string)

  @Prop({ type: [Number], default: [] })
  userVotes: number[];

  // Campo virtual para contar os votos
  get votes(): number {
    return this.userVotes.length;
  }
}

export const PollOptionSchema = SchemaFactory.createForClass(PollOption);

// Adiciona virtual para votos
PollOptionSchema.virtual('votes').get(function (this: PollOption) {
  return this.userVotes.length;
});

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Poll {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  question: string;

  @Prop({ type: [PollOptionSchema], default: [] })
  options: PollOption[];

  @Prop({ type: Date, required: true })
  expiration: Date;
}

export type PollDocument = Poll &
  Document & {
    totalVotes: number;
  };

export const PollSchema = SchemaFactory.createForClass(Poll);

// Campo virtual que calcula votos totais
PollSchema.virtual('totalVotes').get(function (this: PollDocument) {
  return this.options.reduce(
    (total, option) => total + option.userVotes.length,
    0,
  );
});
