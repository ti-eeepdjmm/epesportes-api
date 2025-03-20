import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TimelinePostsService } from './timeline_posts.service';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';

@Controller('timeline-posts')
export class TimelinePostsController {
  constructor(private readonly timelinePostsService: TimelinePostsService) {}

  @Post()
  create(@Body() createTimelinePostDto: CreateTimelinePostDto) {
    return this.timelinePostsService.create(createTimelinePostDto);
  }

  @Get()
  findAll() {
    return this.timelinePostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timelinePostsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timelinePostsService.remove(id);
  }
}