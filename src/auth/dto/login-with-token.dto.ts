// src/auth/dto/login-with-token.dto.ts
export class LoginWithTokenDto {
  provider: 'google'; // ou 'apple', etc
  id_token: string;
  nonce?: string;
}
