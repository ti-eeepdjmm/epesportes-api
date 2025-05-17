import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchStatsService } from './match_stats.service';
import { CreateMatchStatDto } from './dto/create-match_stat.dto';
import { UpdateMatchStatDto } from './dto/update-match_stat.dto';

@Controller('match-stats')
export class MatchStatsController {
  constructor(private readonly matchStatsService: MatchStatsService) {}

  @Post()
  create(@Body() createMatchStatDto: CreateMatchStatDto) {
    return this.matchStatsService.create(createMatchStatDto);
  }

  @Get()
  findAll() {
    return this.matchStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchStatsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatchStatDto: UpdateMatchStatDto,
  ) {
    return this.matchStatsService.update(+id, updateMatchStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchStatsService.remove(+id);
  }

  // ============================================
  // NOVOS ENDPOINTS
  // ============================================

  /** Estatísticas de uma partida específica */
  @Get('match/:matchId')
  findByMatchId(@Param('matchId') matchId: string) {
    return this.matchStatsService.findByMatchId(+matchId);
  }

  /** Estatísticas de um time específico */
  @Get('team/:teamId')
  findByTeamId(@Param('teamId') teamId: string) {
    return this.matchStatsService.findByTeamId(+teamId);
  }
}
