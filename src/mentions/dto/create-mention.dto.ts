// dto/create-mention.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMentionDto {
  @IsOptional()
  @IsString()
  postId?: string;

  @IsOptional()
  @IsString()
  commentId?: string;

  @IsNumber()
  mentionedUserId: number;

  @IsOptional()
  @IsNumber()
  mentionedPlayerId?: number;
}
