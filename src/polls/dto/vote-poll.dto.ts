import { IsNumber, IsString } from 'class-validator';

export class VotePollDto {
  @IsNumber()
  userId: number;

  @IsString()
  optionValue: string;
}
