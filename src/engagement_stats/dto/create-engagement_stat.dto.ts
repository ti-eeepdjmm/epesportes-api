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
  likesReceived: number;

  @IsInt()
  videoViews: number;
}
