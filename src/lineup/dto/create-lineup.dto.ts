import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class CreateLineupDto {
  @IsInt()
  @IsNotEmpty()
  teamId: number;

  @IsInt()
  @IsNotEmpty()
  matchId: number;

  @IsInt()
  @IsNotEmpty()
  playerId: number;

  @IsBoolean()
  titular: boolean;
}
