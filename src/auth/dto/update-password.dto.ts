// dto/update-password.dto.ts
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
