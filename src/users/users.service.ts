import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Injeta o repositório do TypeORM para a entidade User
  ) {}

  // Método para criar um novo usuário
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto); // Cria uma instância do usuário com base no DTO
    return this.userRepository.save(user); // Salva o usuário no banco de dados
  }

  // Método para buscar todos os usuários
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['favoriteTeam'] }); // Retorna todos os usuários, incluindo o relacionamento com o time favorito
  }

  // Método para buscar um único usuário pelo ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id }, // Busca o usuário pelo ID
      relations: ['favoriteTeam'], // Inclui o relacionamento com o time favorito
    });
    if (!user) {
      // Lança uma exceção se o usuário não for encontrado
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user; // Retorna o usuário encontrado
  }

  // Método para atualizar um usuário existente
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Busca o usuário pelo ID (lança exceção se não encontrado)
    Object.assign(user, updateUserDto); // Atualiza os campos do usuário com os dados do DTO
    return this.userRepository.save(user); // Salva as alterações no banco de dados
  }

  // Método para remover um usuário pelo ID
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); // Busca o usuário pelo ID (lança exceção se não encontrado)
    await this.userRepository.remove(user); // Remove o usuário do banco de dados
  }
}
