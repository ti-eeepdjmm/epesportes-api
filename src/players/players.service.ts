import { Injectable, NotFoundException } from '@nestjs/common';
// Importa os decoradores e exceções do NestJS

import { InjectRepository } from '@nestjs/typeorm';
// Importa o decorador para injetar repositórios do TypeORM

import { Repository } from 'typeorm';
// Importa a classe Repository do TypeORM para manipular entidades

import { Player } from './entities/player.entity';
// Importa a entidade Player

import { CreatePlayerDto } from './dto/create-player.dto';
// Importa o DTO para criação de jogadores

import { UpdatePlayerDto } from './dto/update-player.dto';
// Importa o DTO para atualização de jogadores

import { User } from '../users/entities/user.entity';
// Importa a entidade User para relacionar jogadores com usuários

import { Team } from '../teams/entities/team.entity';
// Importa a entidade Team para relacionar jogadores com times

@Injectable()
// Marca a classe como um provedor que pode ser injetado em outros componentes

export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>, 
    // Injeta o repositório do TypeORM para a entidade Player

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
    // Injeta o repositório do TypeORM para a entidade User

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>, 
    // Injeta o repositório do TypeORM para a entidade Team
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    // Método para criar um novo jogador
    const { userId, teamId, position, jerseyNumber } = createPlayerDto;
    // Desestrutura os campos do DTO de criação

    const team = await this.teamRepository.findOneBy({ id: teamId });
    // Busca o time pelo ID fornecido no DTO

    if (!team) {
      // Verifica se o time existe
      throw new NotFoundException(`Team with ID ${teamId} not found`);
      // Lança uma exceção se o time não for encontrado
    }

    const user = userId
      ? await this.userRepository.findOneBy({ id: userId })
      : null;
    // Se o userId for fornecido, busca o usuário pelo ID; caso contrário, define como null

    const player = this.playerRepository.create({
      user,
      team,
      position,
      jerseyNumber,
    });
    // Cria uma instância do jogador com os dados fornecidos

    return this.playerRepository.save(player);
    // Salva o jogador no banco de dados e retorna o jogador criado
  }

  async findAll(): Promise<Player[]> {
    // Método para buscar todos os jogadores
    return this.playerRepository.find({
      relations: ['user', 'team'], 
      // Inclui os relacionamentos com as entidades User e Team
    });
  }

  async findOne(id: number): Promise<Player> {
    // Método para buscar um jogador pelo ID
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ['user', 'team'], 
      // Inclui os relacionamentos com as entidades User e Team
    });

    if (!player) {
      // Verifica se o jogador existe
      throw new NotFoundException(`Player with ID ${id} not found`);
      // Lança uma exceção se o jogador não for encontrado
    }

    return player;
    // Retorna o jogador encontrado
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    // Método para atualizar um jogador existente
    const player = await this.findOne(id);
    // Busca o jogador pelo ID (lança exceção se não encontrado)

    if (updatePlayerDto.teamId) {
      // Verifica se o ID do time foi fornecido no DTO
      const team = await this.teamRepository.findOneBy({
        id: updatePlayerDto.teamId,
      });
      // Busca o time pelo ID fornecido

      if (!team) {
        // Verifica se o time existe
        throw new NotFoundException(
          `Team with ID ${updatePlayerDto.teamId} not found`,
        );
        // Lança uma exceção se o time não for encontrado
      }

      player.team = team;
      // Atualiza o time do jogador
    }

    if (updatePlayerDto.userId) {
      // Verifica se o ID do usuário foi fornecido no DTO
      const user = await this.userRepository.findOneBy({
        id: updatePlayerDto.userId,
      });
      // Busca o usuário pelo ID fornecido

      if (!user) {
        // Verifica se o usuário existe
        throw new NotFoundException(
          `User with ID ${updatePlayerDto.userId} not found`,
        );
        // Lança uma exceção se o usuário não for encontrado
      }

      player.user = user;
      // Atualiza o usuário vinculado ao jogador
    }

    Object.assign(player, updatePlayerDto);
    // Atualiza os campos do jogador com os dados fornecidos no DTO

    return this.playerRepository.save(player);
    // Salva as alterações no banco de dados e retorna o jogador atualizado
  }

  async remove(id: number): Promise<void> {
    // Método para remover um jogador pelo ID
    const player = await this.findOne(id);
    // Busca o jogador pelo ID (lança exceção se não encontrado)

    await this.playerRepository.remove(player);
    // Remove o jogador do banco de dados
  }
}