// -------------------------------------------
// dto/create-timeline_post.dto.ts
// -------------------------------------------
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ReactionsDto {
  @IsArray() @IsOptional() liked?: string[];
  @IsArray() @IsOptional() beast?: string[];
  @IsArray() @IsOptional() plays_great?: string[];
  @IsArray() @IsOptional() amazing_goal?: string[];
  @IsArray() @IsOptional() stylish?: string[];
}

class CommentDto {
  @IsString() userId: string;
  @IsString() content: string;
  @IsOptional() @Type(() => Date) commentDate?: Date;
}

export class CreateTimelinePostDto {
  @IsString() userId: string;
  @IsString() content: string;
  @IsArray() @IsOptional() media?: string[];
  @ValidateNested()
  @Type(() => ReactionsDto)
  @IsOptional()
  reactions?: ReactionsDto;
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  @IsOptional()
  comments?: CommentDto[];
}
