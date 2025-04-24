import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsInt,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsUUID()
  authUserId: string; // UUID do Supabase Auth

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsOptional()
  @IsInt()
  favoriteTeamId?: number;

  @IsOptional()
  @IsBoolean()
  isAthlete?: boolean;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username?: string;
}
