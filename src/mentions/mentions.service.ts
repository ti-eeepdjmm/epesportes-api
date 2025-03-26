import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mention } from './entities/mention.entity';
import { CreateMentionDto } from './dto/create-mention.dto';
import { UpdateMentionDto } from './dto/update-mention.dto';
import { User } from '../users/entities/user.entity';
import { Player } from '../players/entities/player.entity';
import { AppGateway } from '../app-gateway/app/app.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';
import { NotificationType } from '../notifications/schemas/notification.entity';

@Injectable()
export class MentionsService {
  constructor(
    @InjectRepository(Mention)
    private mentionRepo: Repository<Mention>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Player)
    private playerRepo: Repository<Player>,
    private readonly appGateway: AppGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateMentionDto): Promise<Mention> {
    const mencionedUser = await this.userRepo.findOneBy({
      id: dto.mentionedUserId,
    });
    const senderUser = await this.userRepo.findOneBy({
      id: dto.senderUserId,
    });
    if (!mencionedUser)
      throw new NotFoundException('Mentioned user not found!');
    if (!senderUser) throw new NotFoundException('Sender user not found!');

    const player = dto.mentionedPlayerId
      ? await this.playerRepo.findOneBy({ id: dto.mentionedPlayerId })
      : null;

    const mention = this.mentionRepo.create({
      postId: dto.postId,
      commentId: dto.commentId,
      mentionedUser: mencionedUser,
      ...(player && { mentionedPlayer: player }),
      senderUser: senderUser, // só inclui se player for diferente de null
    });
    // create and save the notification
    const newNotification: CreateNotificationDto = {
      type: NotificationType.MENTION,
      message: `Você foi marcado!`,
      date: new Date(),
      link: `posts/${mention.postId}`,
      senderId: mention.senderUser,

    };
    await this.notificationsService.create(newNotification);
    return this.mentionRepo.save(mention);
  }

  findAll(): Promise<Mention[]> {
    return this.mentionRepo.find({
      relations: ['mentionedUser', 'mentionedPlayer'],
    });
  }

  async findOne(id: number): Promise<Mention> {
    const mention = await this.mentionRepo.findOne({
      where: { id },
      relations: ['mentionedUser', 'mentionedPlayer'],
    });
    if (!mention) throw new NotFoundException('Mention not found');
    return mention;
  }

  async update(id: number, updateDto: UpdateMentionDto): Promise<Mention> {
    const mention = await this.findOne(id);

    // Atualiza os campos básicos se estiverem presentes no DTO
    if (updateDto.postId !== undefined) {
      mention.postId = updateDto.postId;
    }
    if (updateDto.commentId !== undefined) {
      mention.commentId = updateDto.commentId;
    }

    // Atualiza o usuário mencionado, se for informado
    if (updateDto.mentionedUserId !== undefined) {
      const user = await this.userRepo.findOneBy({
        id: updateDto.mentionedUserId,
      });
      if (!user) throw new NotFoundException('Mentioned user not found');
      mention.mentionedUser = user;
    }

    // Atualiza o jogador mencionado, se for informado (pode ser null para remover a associação)
    if (updateDto.mentionedPlayerId !== undefined) {
      if (updateDto.mentionedPlayerId === null) {
        mention.mentionedPlayer = null;
      } else {
        const player = await this.playerRepo.findOneBy({
          id: updateDto.mentionedPlayerId,
        });
        if (!player) throw new NotFoundException('Mentioned player not found');
        mention.mentionedPlayer = player;
      }
    }

    return this.mentionRepo.save(mention);
  }

  async remove(id: number): Promise<Mention> {
    const mention = await this.findOne(id);
    return this.mentionRepo.remove(mention);
  }
}
