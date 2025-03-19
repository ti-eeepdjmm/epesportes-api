import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LineupService } from './lineup.service';
import { CreateLineupDto } from './dto/create-lineup.dto';
import { UpdateLineupDto } from './dto/update-lineup.dto';

@Controller('lineup')
export class LineupController {
  constructor(private readonly lineupService: LineupService) {}

  @Post()
  create(@Body() createLineupDto: CreateLineupDto) {
    return this.lineupService.create(createLineupDto);
  }

  @Get()
  findAll() {
    return this.lineupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLineupDto: UpdateLineupDto) {
    return this.lineupService.update(+id, updateLineupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineupService.remove(+id);
  }
}