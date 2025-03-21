import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateEngagementStatDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  postsCreated: number;

  @IsInt()
  commentsMade: number;

  @IsInt()
  reactionsReceived: number;

  @IsInt()
  videoViews: number;
}
