import {
  IsString,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreatePollOptionDto {
  @IsString() option: string;
}

export class CreatePollDto {
  @IsString() userId: number;
  @IsString() question: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePollOptionDto)
  options: CreatePollOptionDto[];
  @IsDateString() expiration: Date;
}
