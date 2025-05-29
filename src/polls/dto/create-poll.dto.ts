import {
  IsString,
  IsArray,
  ValidateNested,
  IsDateString,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

const allowedOptionTypes = ['text', 'user', 'team'] as const;
type PollOptionType = (typeof allowedOptionTypes)[number];

class CreatePollOptionDto {
  @IsIn(allowedOptionTypes)
  type: PollOptionType;

  @IsString()
  value: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  userVotes?: number[];
}

export class CreatePollDto {
  @IsNumber()
  userId: number;

  @IsString()
  question: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePollOptionDto)
  options: CreatePollOptionDto[];

  @IsDateString()
  expiration: Date;
}
