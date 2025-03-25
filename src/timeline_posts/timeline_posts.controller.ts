import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TimelinePostsService } from './timeline_posts.service';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { UpdateTimelinePostDto } from './dto/update-timeline_post.dto';
@Controller('timeline-posts')
export class TimelinePostsController {
  constructor(private readonly timelinePostsService: TimelinePostsService) {}

  @Post()
  create(@Body() createPostDto: CreateTimelinePostDto) {
    return this.timelinePostsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.timelinePostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timelinePostsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdateTimelinePostDto,
  ) {
    return this.timelinePostsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timelinePostsService.remove(id);
  }
}
