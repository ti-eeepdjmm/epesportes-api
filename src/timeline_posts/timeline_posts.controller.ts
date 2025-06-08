import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TimelinePostsService } from './timeline_posts.service';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { UpdateTimelinePostDto } from './dto/update-timeline_post.dto';

type ReactionType =
  | 'liked'
  | 'beast'
  | 'plays_great'
  | 'amazing_goal'
  | 'stylish';

interface AddReactionDto {
  reactionType: ReactionType;
  userId: number;
}

@Controller('timeline-posts')
export class TimelinePostsController {
  constructor(private readonly timelinePostsService: TimelinePostsService) {}

  // Criar um novo post
  @Post()
  create(@Body() createPostDto: CreateTimelinePostDto) {
    return this.timelinePostsService.create(createPostDto);
  }

  // Buscar todos os posts
  @Get()
  async findAllPaginated(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('userId') userId?: string,
  ) {
    const currentPage = parseInt(page, 10);
    const currentLimit = parseInt(limit, 10);
    const parsedUserId = userId ? parseInt(userId, 10) : undefined;

    return this.timelinePostsService.findAllPaginated(
      currentPage,
      currentLimit,
      parsedUserId,
    );
  }

  // Buscar um post específico
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timelinePostsService.findOne(id);
  }

  // Atualizar um post
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdateTimelinePostDto,
  ) {
    return this.timelinePostsService.update(id, updatePostDto);
  }

  // Remover um post
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timelinePostsService.remove(id);
  }
  @Post(':id/react')
  addReaction(@Param('id') id: string, @Body() body: AddReactionDto) {
    // eslint-disable-next-line prettier/prettier
    return this.timelinePostsService.addReaction(
      id,
      body.reactionType,
      body.userId,
    );
  }

  @Post(':id/comment')
  addComment(
    @Param('id') id: string,
    @Body() body: { userId: number; content: string },
  ) {
    return this.timelinePostsService.addComment(id, body.userId, body.content);
  }
}
