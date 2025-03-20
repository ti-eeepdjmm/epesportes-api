import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRankingDto {
  @IsInt()
  @IsNotEmpty()
  playerId: number;

  @IsInt()
  goals: number;

  @IsInt()
  assists: number;

  @IsInt()
  yellowCards: number;

  @IsInt()
  redCards: number;
}
