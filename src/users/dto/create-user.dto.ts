import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string; // Nome do usuário

  @IsEmail()
  email: string; // Email único

  @IsString()
  password: string; // Senha (hash)

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
