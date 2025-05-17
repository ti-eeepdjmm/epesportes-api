import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchStat } from './entities/match_stat.entity';
import { CreateMatchStatDto } from './dto/create-match_stat.dto';
import { UpdateMatchStatDto } from './dto/update-match_stat.dto';
import { Match } from '../matches/entities/match.entity';
import { Team } from '../teams/entities/team.entity';

@Injectable()
export class MatchStatsService {
  constructor(
    @InjectRepository(MatchStat)
    private readonly matchStatsRepository: Repository<MatchStat>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createMatchStatsDto: CreateMatchStatDto): Promise<MatchStat> {
    const {
      matchId,
      teamId,
      goals,
      playersGoals,
      fouls,
      shots,
      penalties,
      possession,
    } = createMatchStatsDto;

    const match = await this.matchRepository.findOne({
      where: { id: matchId },
    });
    if (!match) throw new NotFoundException('Match not found');

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Team not found');

    const matchStats = this.matchStatsRepository.create({
      match,
      team,
      goals,
      playersGoals,
      fouls,
      shots,
      penalties,
      possession,
    });
    return this.matchStatsRepository.save(matchStats);
  }

  async findAll(): Promise<MatchStat[]> {
    return this.matchStatsRepository.find({ relations: ['match', 'team'] });
  }

  async findOne(id: number): Promise<MatchStat> {
    const matchStats = await this.matchStatsRepository.findOne({
      where: { id },
      relations: ['match', 'team'],
    });
    if (!matchStats) throw new NotFoundException('Match stats not found');
    return matchStats;
  }

  async update(
    id: number,
    updateMatchStatsDto: UpdateMatchStatDto,
  ): Promise<MatchStat> {
    const matchStats = await this.findOne(id);
    Object.assign(matchStats, updateMatchStatsDto);
    return this.matchStatsRepository.save(matchStats);
  }

  async remove(id: number): Promise<void> {
    const result = await this.matchStatsRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Match stats not found');
  }

  // ============================================
  // NOVOS MÉTODOS DE BUSCA
  // ============================================

  /**
   * Retorna todas as estatísticas associadas a uma partida específica.
   * @param matchId ID da partida
   */
  async findByMatchId(matchId: number): Promise<MatchStat[]> {
    const stats = await this.matchStatsRepository.find({
      where: { match: { id: matchId } },
      relations: ['match', 'team'],
    });
    if (!stats || stats.length === 0) {
      throw new NotFoundException(
        `No match stats found for match with id ${matchId}`,
      );
    }
    return stats;
  }

  /**
   * Retorna todas as estatísticas associadas a um time específico.
   * @param teamId ID do time
   */
  async findByTeamId(teamId: number): Promise<MatchStat[]> {
    const stats = await this.matchStatsRepository.find({
      where: { team: { id: teamId } },
      relations: ['match', 'team'],
    });
    if (!stats || stats.length === 0) {
      throw new NotFoundException(
        `No match stats found for team with id ${teamId}`,
      );
    }
    return stats;
  }
}
