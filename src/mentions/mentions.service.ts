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
import { NotificationType } from '../notifications/schemas/notification.entity';
import { NotificationPayload } from '../common/types/socket-events.types';

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

  private async findUserOrFail(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  private async findPlayerIfExists(id?: number | null): Promise<Player | null> {
    if (id === null || id === undefined) return null;
    const player = await this.playerRepo.findOneBy({ id });
    if (!player) throw new NotFoundException(`Player with ID ${id} not found`);
    return player;
  }

  async create(dto: CreateMentionDto): Promise<Mention> {
    const mentionedUser = await this.findUserOrFail(dto.mentionedUserId);
    const senderUser = await this.findUserOrFail(dto.senderUserId);
    const player = await this.findPlayerIfExists(dto.mentionedPlayerId);

    const mention = this.mentionRepo.create({
      postId: dto.postId,
      commentId: dto.commentId,
      mentionedUser,
      senderUser,
      mentionedPlayer: player,
    });

    await this.notificationsService.create({
      type: NotificationType.MENTION,
      message: `${senderUser.name} mencionou você em um comentário`,
      date: new Date(),
      link: `posts/${mention.postId}`,
      senderId: senderUser.id,
      recipientId: mentionedUser.id,
    });

    this.appGateway.emitNotification(mentionedUser.id, {
      message: `${senderUser.name} mencionou você em um comentário`,
      type: 'mention',
      link: `posts/${mention.postId}`,
      sender: {
        id: senderUser.id,
        name: senderUser.name,
        avatar: senderUser.password, // esse campo tá estranho, talvez seja user.avatar?
      },
      timestamp: Date.now(),
    });

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
      relations: ['mentionedUser', 'mentionedPlayer', 'senderUser'],
    });
    if (!mention) throw new NotFoundException('Mention not found');
    return mention;
  }

  async update(id: number, dto: UpdateMentionDto): Promise<Mention> {
    const mention = await this.findOne(id);

    Object.assign(mention, {
      postId: dto.postId ?? mention.postId,
      commentId: dto.commentId ?? mention.commentId,
    });

    if (dto.mentionedUserId !== undefined) {
      mention.mentionedUser = await this.findUserOrFail(dto.mentionedUserId);
    }

    if (dto.mentionedPlayerId !== undefined) {
      mention.mentionedPlayer = await this.findPlayerIfExists(
        dto.mentionedPlayerId,
      );
    }

    const updatedMention = await this.mentionRepo.save(mention);

    // Notificação
    const sender = updatedMention.senderUser; // já vem populado da relação se você garantir isso com o relation ou carregar antes
    const recipient = updatedMention.mentionedUser;

    await this.notificationsService.create({
      type: NotificationType.MENTION,
      message: `Você foi mencionado (atualizado)!`,
      date: new Date(),
      link: `posts/${updatedMention.postId}`,
      senderId: sender.id,
      recipientId: recipient.id,
    });

    const payload: NotificationPayload = {
      message: `${sender.name} atualizou uma menção a você`,
      type: 'mention',
      link: `posts/${updatedMention.postId}`,
      sender: {
        id: sender.id,
        name: sender.name,
        avatar: sender.profilePhoto,
      },
      timestamp: Date.now(),
    };

    this.appGateway.emitNotification(recipient.id, payload);

    return updatedMention;
  }

  async remove(id: number): Promise<Mention> {
    const mention = await this.findOne(id);
    return this.mentionRepo.remove(mention);
  }
}
