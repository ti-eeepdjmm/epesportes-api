import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LineupsService } from './lineups.service';
import { CreateLineupDto } from './dto/create-lineup.dto';
import { UpdateLineupDto } from './dto/update-lineup.dto';

@Controller('lineups')
export class LineupsController {
  constructor(private readonly lineupsService: LineupsService) {}

  @Post()
  create(@Body() createLineupDto: CreateLineupDto) {
    return this.lineupsService.create(createLineupDto);
  }

  @Get()
  findAll() {
    return this.lineupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLineupDto: UpdateLineupDto) {
    return this.lineupsService.update(+id, updateLineupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineupsService.remove(+id);
  }
}
