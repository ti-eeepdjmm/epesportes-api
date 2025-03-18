import { IsString, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string; // Nome do time

  @IsString()
  @IsOptional()
  logo: string; // URL ou caminho do logo do time (opcional)
}