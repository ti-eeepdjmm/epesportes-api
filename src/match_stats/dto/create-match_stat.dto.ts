import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateMatchStatDto {
  @IsInt()
  @IsNotEmpty()
  matchId: number;

  @IsInt()
  @IsNotEmpty()
  teamId: number;

  @IsInt()
  goals: number;

  @IsObject()
  @IsOptional()
  playersGoals?: Record<string, number>;

  @IsInt()
  fouls: number;

  @IsInt()
  shots: number;

  @IsInt()
  penalties: number;

  @IsNumber()
  possession: number;
}
