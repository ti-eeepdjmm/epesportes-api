import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Post()
  create(@Body() createRankingDto: CreateRankingDto) {
    return this.rankingsService.create(createRankingDto);
  }

  @Get()
  findAll() {
    return this.rankingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rankingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRankingDto: UpdateRankingDto) {
    return this.rankingsService.update(+id, updateRankingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rankingsService.remove(+id);
  }
}
