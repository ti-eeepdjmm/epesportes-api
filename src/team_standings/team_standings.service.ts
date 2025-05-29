import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamStanding } from './entities/team_standing.entity';
import { CreateTeamStandingDto } from './dto/create-team_standing.dto';
import { UpdateTeamStandingDto } from './dto/update-team_standing.dto';
import { Team } from '../teams/entities/team.entity';

@Injectable()
export class TeamStandingsService {
  constructor(
    @InjectRepository(TeamStanding)
    private readonly teamStandingRepository: Repository<TeamStanding>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(
    createTeamStandingDto: CreateTeamStandingDto,
  ): Promise<TeamStanding> {
    const {
      teamId,
      points,
      wins,
      draws,
      losses,
      goalsScored,
      goalsConceded,
      goalDifference,
    } = createTeamStandingDto;

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Team not found');

    const teamStanding = this.teamStandingRepository.create({
      team,
      points,
      wins,
      draws,
      losses,
      goalsScored,
      goalsConceded,
      goalDifference,
    });
    return this.teamStandingRepository.save(teamStanding);
  }

  async findAll(): Promise<TeamStanding[]> {
    return this.teamStandingRepository.find({ relations: ['team'] });
  }

  async findOne(id: number): Promise<TeamStanding> {
    const teamStanding = await this.teamStandingRepository.findOne({
      where: { id },
      relations: ['team'],
    });
    if (!teamStanding) throw new NotFoundException('Team standing not found');
    return teamStanding;
  }

  async findAllOrderedByPoints(): Promise<TeamStanding[]> {
    return this.teamStandingRepository.find({
      relations: ['team'],
      order: {
        points: 'DESC',
        goalDifference: 'DESC', // critério de desempate adicionado
      },
    });
  }

  async update(
    id: number,
    updateTeamStandingDto: UpdateTeamStandingDto,
  ): Promise<TeamStanding> {
    const teamStanding = await this.findOne(id);
    Object.assign(teamStanding, updateTeamStandingDto);
    return this.teamStandingRepository.save(teamStanding);
  }

  async remove(id: number): Promise<void> {
    const result = await this.teamStandingRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Team standing not found');
  }
}
