import {
  IsString,
  IsArray,
  ValidateNested,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreatePollOptionDto {
  @IsString()
  option: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional() // opcional na criação (iniciado como array vazio)
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
