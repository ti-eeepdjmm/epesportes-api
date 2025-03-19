import { IsString, IsEmail, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string; // Nome do usuário (opcional)

  @IsEmail()
  @IsOptional()
  email?: string; // Email único (opcional)

  @IsString()
  @IsOptional()
  password?: string; // Senha (hash, opcional)

  @IsString()
  @IsOptional()
  profilePhoto?: string; // Foto de perfil (opcional)

  @IsOptional()
  favoriteTeamId?: number; // ID do time favorito (opcional)

  @IsBoolean()
  @IsOptional()
  isAthlete?: boolean; // Indica se é atleta (opcional)

  @IsDateString()
  @IsOptional()
  birthDate?: Date; // Data de nascimento (opcional)
}