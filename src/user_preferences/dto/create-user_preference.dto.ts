import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserPreferenceDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsBoolean()
  darkMode: boolean;

  @IsBoolean()
  notificationsEnabled: boolean;
}
