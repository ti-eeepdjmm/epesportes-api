// dto/create-mention.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMentionDto {
  @IsOptional()
  @IsString()
  postId?: string;

  @IsOptional()
  @IsNumber()
  commentId?: number;

  @IsNumber()
  mentionedUserId: number;

  @IsNumber()
  senderUserId: number;

  @IsOptional()
  @IsNumber()
  mentionedPlayerId?: number;
}
