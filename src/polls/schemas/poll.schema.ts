import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PollDocument = Poll & Document;

class PollOption {
  @Prop({ required: true })
  option: string;

  @Prop({ default: 0 })
  votes: number;
}

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Poll {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  question: string;

  @Prop({ type: [PollOption], default: [] })
  options: PollOption[];

  @Prop({ type: Date, required: true })
  expiration: Date;
}

export const PollSchema = SchemaFactory.createForClass(Poll);

// Campo virtual que calcula a soma dos votos de cada opção
PollSchema.virtual('totalVotes').get(function (this: PollDocument) {
  return this.options.reduce((total, option) => total + option.votes, 0);
});
