import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EngagementStat } from './entities/engagement_stat.entity';
import { CreateEngagementStatDto } from './dto/create-engagement_stat.dto';
import { UpdateEngagementStatDto } from './dto/update-engagement_stat.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EngagementStatsService {
  constructor(
    @InjectRepository(EngagementStat)
    private readonly engagementStatRepository: Repository<EngagementStat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createEngagementStatDto: CreateEngagementStatDto): Promise<EngagementStat> {
    const { userId, postsCreated, commentsMade, likesReceived, videoViews } = createEngagementStatDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const engagementStat = this.engagementStatRepository.create({
      user,
      postsCreated,
      commentsMade,
      likesReceived,
      videoViews,
    });
    return this.engagementStatRepository.save(engagementStat);
  }

  async findAll(): Promise<EngagementStat[]> {
    return this.engagementStatRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<EngagementStat> {
    const engagementStat = await this.engagementStatRepository.findOne({ where: { id }, relations: ['user'] });
    if (!engagementStat) throw new NotFoundException('Engagement stats not found');
    return engagementStat;
  }

  async update(id: number, updateEngagementStatDto: UpdateEngagementStatDto): Promise<EngagementStat> {
    const engagementStat = await this.findOne(id);
    Object.assign(engagementStat, updateEngagementStatDto);
    return this.engagementStatRepository.save(engagementStat);
  }

  async remove(id: number): Promise<void> {
    const result = await this.engagementStatRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Engagement stats not found');
  }
}