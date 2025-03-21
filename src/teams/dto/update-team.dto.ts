import { IsString, IsOptional } from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  name?: string; // Nome do time (opcional)

  @IsString()
  @IsOptional()
  logo?: string; // URL ou caminho do logo do time (opcional)
}
