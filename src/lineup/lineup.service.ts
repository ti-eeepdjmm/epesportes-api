import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lineup } from './entities/lineup.entity';
import { CreateLineupDto } from './dto/create-lineup.dto';
import { UpdateLineupDto } from './dto/update-lineup.dto';
import { Team } from '../teams/entities/team.entity';
import { Match } from '../matches/entities/match.entity';
import { Player } from '../players/entities/player.entity';

@Injectable()
export class LineupService {
  constructor(
    @InjectRepository(Lineup) private lineupRepository: Repository<Lineup>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(Match) private matchRepository: Repository<Match>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
  ) { }

  async create(createLineupDto: CreateLineupDto): Promise<Lineup> {
    const { teamId, matchId, playerId, titular } = createLineupDto;
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Team not found');

    const match = await this.matchRepository.findOne({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');

    const player = await this.playerRepository.findOne({ where: { id: playerId } });
    if (!player) throw new NotFoundException('Player not found');

    const lineup = this.lineupRepository.create({ team, match, player, titular });
    return this.lineupRepository.save(lineup);
  }

  async findAll(): Promise<Lineup[]> {
    return this.lineupRepository.find();
  }

  async findOne(id: number): Promise<Lineup> {
    const lineup = await this.lineupRepository.findOne({ where: { id } });
    if (!lineup) throw new NotFoundException('Lineup not found');
    return lineup;
  }

  async update(id: number, updateLineupDto: UpdateLineupDto): Promise<Lineup> {
    const lineup = await this.findOne(id);
    Object.assign(lineup, updateLineupDto);
    return this.lineupRepository.save(lineup);
  }

  async remove(id: number): Promise<void> {
    const result = await this.lineupRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Lineup not found');
  }
}