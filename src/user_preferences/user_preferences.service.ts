import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './entities/user_preference.entity';
import { CreateUserPreferenceDto } from './dto/create-user_preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user_preference.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: Repository<UserPreference>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserPreferenceDto: CreateUserPreferenceDto,
  ): Promise<UserPreference> {
    const { userId, darkMode, notificationsEnabled } = createUserPreferenceDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const userPreference = this.userPreferenceRepository.create({
      user,
      darkMode,
      notificationsEnabled,
    });
    return this.userPreferenceRepository.save(userPreference);
  }

  async findAll(): Promise<UserPreference[]> {
    return this.userPreferenceRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<UserPreference> {
    const userPreference = await this.userPreferenceRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!userPreference)
      throw new NotFoundException('User preference not found');
    return userPreference;
  }

  async update(
    id: number,
    updateUserPreferenceDto: UpdateUserPreferenceDto,
  ): Promise<UserPreference> {
    const userPreference = await this.findOne(id);
    Object.assign(userPreference, updateUserPreferenceDto);
    return this.userPreferenceRepository.save(userPreference);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userPreferenceRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('User preference not found');
  }
}
