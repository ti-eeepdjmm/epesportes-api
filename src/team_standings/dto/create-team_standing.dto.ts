import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateTeamStandingDto {
  @IsInt()
  @IsNotEmpty()
  teamId: number;

  @IsInt()
  points: number;

  @IsInt()
  wins: number;

  @IsInt()
  draws: number;

  @IsInt()
  losses: number;

  @IsInt()
  goalsScored: number;

  @IsInt()
  goalsConceded: number;

  @IsInt()
  goalDifference: number;
}
