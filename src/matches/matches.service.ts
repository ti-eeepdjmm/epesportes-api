import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Game } from '../games/entities/game.entity';
import { Team } from '../teams/entities/team.entity';
import { AppGateway } from '../app-gateway/app/app.gateway';
import { MatchUpdatePayload } from '../common/types/socket-events.types';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly appGateway: AppGateway,
  ) {}

  private emitMatchUpdateEvents(before: Match, after: Match) {
    // aqui você compara e emite os eventos
    if (
      (before.score_team1 !== after.score_team1 ||
        before.score_team2 !== after.score_team2) &&
      (before.status !== 'completed' || after.status !== 'completed')
    ) {
      this.appGateway.emitMatchUpdate({
        matchId: before.id,
        type: 'goal',
        title: 'GOL!',
        message: `${after.team1.name} ${after.score_team1} x ${after.score_team2} ${after.team2.name}`,
        teams: {
          team1: {
            name: after.team1.name,
            logoUrl: after.team1.logo,
            score: after.score_team1,
          },
          team2: {
            name: after.team2.name,
            logoUrl: after.team2.logo,
            score: after.score_team2,
          },
        },
        timestamp: Date.now(),
      });
    }

    if (before.status !== 'completed' && after.status === 'completed') {
      this.appGateway.emitMatchUpdate({
        matchId: before.id,
        type: 'completed',
        title: 'Fim de jogo!',
        message: `${after.team1.name} ${after.score_team1} x ${after.score_team2} ${after.team2.name}`,
        teams: {
          team1: { name: after.team1.name, score: after.score_team1 },
          team2: { name: after.team2.name, score: after.score_team2 },
        },
        timestamp: Date.now(),
      });
    }
  }

  // funcoes REST
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
    const payload: MatchUpdatePayload = {
      matchId: match.id,
      type: 'scheduled',
      title: 'Partida marcada!',
      message: `Equipe ${team1.name} x ${team2.name}`,
      teams: {
        team1: { name: team1.name, logoUrl: team1.logo, score: score_team1 },
        team2: { name: team2.name, logoUrl: team2.logo, score: score_team2 },
      },
      timestamp: Date.now(),
    };
    this.appGateway.emitMatchUpdate(payload);
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
    const matchBefore = await this.findOne(id);
    const matchAfter = { ...matchBefore, ...updateMatchDto };
    this.emitMatchUpdateEvents(matchBefore, matchAfter);
    return this.matchRepository.save(matchAfter);
  }

  async remove(id: number): Promise<void> {
    const result = await this.matchRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Match not found');
  }
}
