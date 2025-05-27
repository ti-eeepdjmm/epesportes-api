// src/polls/dto/vote-poll.dto.ts
import { IsNumber, IsString } from 'class-validator';

export class VotePollDto {
  @IsNumber()
  userId: number;

  @IsString()
  option: string;
}
