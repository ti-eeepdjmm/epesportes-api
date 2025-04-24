import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

import { User } from '../users/entities/user.entity';
import { Team } from '../teams/entities/team.entity';
import { Game } from '../games/entities/game.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { userId, teamId, gameId, position, jerseyNumber } = createPlayerDto;

    const team = await this.teamRepository.findOneBy({ id: teamId });
    const game = await this.gameRepository.findOneBy({ id: gameId });
    const user = await this.userRepository.findOneBy({ id: userId });

    // Previne uso de valores undefined/null
    if (!team || !game || !user) {
      throw new NotFoundException('Erro not found(team | game | user)!'); // Se quiser, pode customizar com exceções
    }

    const player = this.playerRepository.create({
      user: user ?? undefined,
      team,
      game,
      position,
      jerseyNumber,
    });

    return this.playerRepository.save(player);
  }

  async findAll(): Promise<Player[]> {
    return this.playerRepository.find({
      relations: ['user', 'team', 'game'],
    });
  }

  async findOne(id: number): Promise<Player | null> {
    return this.playerRepository.findOne({
      where: { id },
      relations: ['user', 'team', 'game'],
    });
  }

  async findByUser(userId: number): Promise<Player | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found!');
    return this.playerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'team', 'game'],
    });
  }

  async update(
    id: number,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player | null> {
    const player = await this.findOne(id);
    if (!player) return null;

    if (updatePlayerDto.teamId) {
      const team = await this.teamRepository.findOneBy({
        id: updatePlayerDto.teamId,
      });
      if (team) player.team = team;
    }

    if (updatePlayerDto.userId) {
      const user = await this.userRepository.findOneBy({
        id: updatePlayerDto.userId,
      });
      if (user) player.user = user;
    }

    if (updatePlayerDto.gameId) {
      const game = await this.gameRepository.findOneBy({
        id: updatePlayerDto.gameId,
      });
      if (game) player.game = game;
    }

    Object.assign(player, updatePlayerDto);

    return this.playerRepository.save(player);
  }

  async remove(id: number): Promise<void> {
    const player = await this.findOne(id);
    if (player) {
      await this.playerRepository.remove(player);
    }
  }
}
