import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdatePlayerDto {
  @IsOptional()
  @IsNumber()
  userId?: number; // ID do usuário vinculado (opcional)

  @IsOptional()
  @IsNumber()
  teamId?: number; // ID do time (opcional)

  @IsOptional()
  @IsString()
  position?: string; // Posição do jogador (opcional)

  @IsOptional()
  @IsNumber()
  jerseyNumber?: number; // Número da camisa do jogador (opcional)
}