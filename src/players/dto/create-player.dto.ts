import { IsString, IsNumber } from 'class-validator';

export class CreatePlayerDto {
  @IsNumber()
  userId: number; // ID do usuário vinculado (opcional)

  @IsNumber()
  teamId: number; // ID do time (obrigatório)

  @IsNumber()
  gameId: number; // ID do time (obrigatório)

  @IsString()
  position: string; // Posição do jogador (obrigatório)

  @IsNumber()
  jerseyNumber: number; // Número da camisa do jogador (obrigatório)
}
