import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EngagementStatsService } from './engagement_stats.service';
import { CreateEngagementStatDto } from './dto/create-engagement_stat.dto';
import { UpdateEngagementStatDto } from './dto/update-engagement_stat.dto';

@Controller('engagement-stats')
export class EngagementStatsController {
  constructor(
    private readonly engagementStatsService: EngagementStatsService,
  ) {}

  @Post()
  create(@Body() createEngagementStatDto: CreateEngagementStatDto) {
    return this.engagementStatsService.create(createEngagementStatDto);
  }

  @Get()
  findAll() {
    return this.engagementStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.engagementStatsService.findOne(+id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.engagementStatsService.findByUserId(+userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEngagementStatDto: UpdateEngagementStatDto,
  ) {
    return this.engagementStatsService.update(+id, updateEngagementStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.engagementStatsService.remove(+id);
  }
}
