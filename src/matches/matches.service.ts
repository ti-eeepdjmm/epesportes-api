import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Game } from '../games/entities/game.entity';
import { Team } from '../teams/entities/team.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const {
      gameId,
      team1Id,
      team2Id,
      score_team1,
      score_team2,
      status,
      dateTime,
    } = createMatchDto;

    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Game not found');

    const team1 = await this.teamRepository.findOne({ where: { id: team1Id } });
    if (!team1) throw new NotFoundException('Team 1 not found');

    const team2 = await this.teamRepository.findOne({ where: { id: team2Id } });
    if (!team2) throw new NotFoundException('Team 2 not found');

    const match = this.matchRepository.create({
      game,
      team1,
      team2,
      score_team1,
      score_team2,
      status,
      dateTime,
    });
    return this.matchRepository.save(match);
  }

  async findAll(): Promise<Match[]> {
    return this.matchRepository.find({ relations: ['game', 'team1', 'team2'] });
  }

  async findOne(id: number): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id },
      relations: ['game', 'team1', 'team2'],
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.findOne(id);
    Object.assign(match, updateMatchDto);
    return this.matchRepository.save(match);
  }

  async remove(id: number): Promise<void> {
    const result = await this.matchRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Match not found');
  }
}
