import { IsInt, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';

export class CreateMatchDto {
  @IsInt()
  @IsNotEmpty()
  gameId: number;

  @IsInt()
  @IsNotEmpty()
  team1Id: number;

  @IsInt()
  @IsNotEmpty()
  team2Id: number;

  @IsInt()
  score_team1: number;

  @IsInt()
  score_team2: number;

  @IsEnum(['scheduled', 'in progress', 'completed'])
  status: string;

  @IsDateString()
  dateTime: Date;
}
