import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamStandingsService } from './team_standings.service';
import { CreateTeamStandingDto } from './dto/create-team_standing.dto';
import { UpdateTeamStandingDto } from './dto/update-team_standing.dto';

@Controller('team-standings')
export class TeamStandingsController {
  constructor(private readonly teamStandingsService: TeamStandingsService) {}

  @Post()
  create(@Body() createTeamStandingDto: CreateTeamStandingDto) {
    return this.teamStandingsService.create(createTeamStandingDto);
  }

  @Get()
  findAll() {
    return this.teamStandingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamStandingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamStandingDto: UpdateTeamStandingDto) {
    return this.teamStandingsService.update(+id, updateTeamStandingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamStandingsService.remove(+id);
  }
}
