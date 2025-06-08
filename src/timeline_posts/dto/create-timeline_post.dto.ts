// -------------------------------------------
// dto/create-timeline_post.dto.ts
// -------------------------------------------
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ReactionsDto {
  @IsArray() @IsOptional() liked?: number[];
  @IsArray() @IsOptional() beast?: number[];
  @IsArray() @IsOptional() plays_great?: number[];
  @IsArray() @IsOptional() amazing_goal?: number[];
  @IsArray() @IsOptional() stylish?: number[];
}

export class CommentDto {
  @IsString() userId: number;
  @IsString() content: string;
  @IsOptional() @Type(() => Date) commentDate?: Date;
}

export class CreateTimelinePostDto {
  @IsString() userId: number;
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
