import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from './entities/ranking.entity';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { Player } from '../players/entities/player.entity';

@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(Ranking)
    private readonly rankingRepository: Repository<Ranking>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async create(createRankingDto: CreateRankingDto): Promise<Ranking> {
    const { playerId, goals, assists, yellowCards, redCards } = createRankingDto;

    const player = await this.playerRepository.findOne({ where: { id: playerId } });
    if (!player) throw new NotFoundException('Player not found');

    const ranking = this.rankingRepository.create({ player, goals, assists, yellowCards, redCards });
    return this.rankingRepository.save(ranking);
  }

  async findAll(): Promise<Ranking[]> {
    return this.rankingRepository.find({ relations: ['player'] });
  }

  async findOne(id: number): Promise<Ranking> {
    const ranking = await this.rankingRepository.findOne({ where: { id }, relations: ['player'] });
    if (!ranking) throw new NotFoundException('Ranking not found');
    return ranking;
  }

  async update(id: number, updateRankingDto: UpdateRankingDto): Promise<Ranking> {
    const ranking = await this.findOne(id);
    Object.assign(ranking, updateRankingDto);
    return this.rankingRepository.save(ranking);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rankingRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Ranking not found');
  }
}