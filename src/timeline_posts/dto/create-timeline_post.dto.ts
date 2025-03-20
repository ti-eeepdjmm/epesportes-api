import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateTimelinePostDto {
  @IsString()
  userId: string;

  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  media?: string[];
}
