import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TimelinePost } from './schemas/timeline_post.schema';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { UpdateTimelinePostDto } from './dto/update-timeline_post.dto';
import { AppGateway } from '../app-gateway/app/app.gateway';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewPostPayload } from 'src/common/types/socket-events.types';

@Injectable()
export class TimelinePostsService {
  constructor(
    @InjectModel(TimelinePost.name)
    private timelinePostModel: Model<TimelinePost>,
    @InjectRepository(User)
    private userRepository: Repository<User>, // ✅ correto para TypeORM// <-- corrigido
    private readonly appGateway: AppGateway,
  ) {}

  async create(createPostDto: CreateTimelinePostDto): Promise<TimelinePost> {
    const newPost = new this.timelinePostModel(createPostDto);
    const payload: NewPostPayload = {
      author: newPost.userId,
      postId: (newPost._id as string).toString(),
      timestamp: Date.now(),
    };
    this.appGateway.emitNewPost(payload);
    return newPost.save();
  }

  async findAll(): Promise<TimelinePost[]> {
    return this.timelinePostModel.find().exec();
  }

  async findOne(id: string): Promise<TimelinePost | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId format');
    }
    return this.timelinePostModel.findById(new Types.ObjectId(id)).exec();
  }

  async update(
    id: string,
    updatePostDto: UpdateTimelinePostDto,
  ): Promise<TimelinePost | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId format');
    }

    // 1. Buscar o post original antes da atualização
    const postBefore = await this.timelinePostModel.findById(id);
    if (!postBefore) {
      throw new NotFoundException('Post não encontrado');
    }

    // 2. Simular o novo estado do post após update
    const postAfter = { ...postBefore, ...updatePostDto };

    // 3. Verificar se houve novo comentário
    const oldComments = postBefore.comments ?? [];
    const newComments = postAfter.comments ?? [];

    if (newComments.length > oldComments.length) {
      const newComment = newComments[newComments.length - 1];

      // Não notifica se o autor comentou no próprio post
      if (newComment.userId !== postBefore.userId) {
        const user = await this.userRepository.findOne({
          where: { id: newComment.userId },
        });

        if (user) {
          this.appGateway.emitNotification(postBefore.userId, {
            type: 'comment',
            message: `${user.name} comentou no seu post`,
            link: `/timeline-posts/${id}`,
            sender: {
              id: user.id,
              name: user.name,
              avatar: user.profilePhoto,
            },
            timestamp: Date.now(),
          });
        }
      }
    }

    // 4. Verificar se houve nova reação em qualquer categoria
    const oldReactions = postBefore.reactions ?? {};
    const newReactions = postAfter.reactions ?? {};

    const reactionTypes = Object.keys(
      newReactions,
    ) as (keyof typeof newReactions)[];
    for (const reactionType of reactionTypes) {
      const oldList = oldReactions[reactionType] ?? [];
      const newList = newReactions[reactionType] ?? [];

      if (newList.length > oldList.length) {
        const userId = newList[newList.length - 1];

        // Evita notificar o autor do post por sua própria reação
        if (userId !== postBefore.userId) {
          const user = await this.userRepository.findOne({
            where: { id: userId },
          });

          if (user) {
            this.appGateway.emitNotification(postBefore.userId, {
              type: 'reaction',
              message: `${user.name} reagiu ao seu post!`,
              link: `/timeline-posts/${id}`,
              reaction: reactionType,
              sender: {
                id: user.id,
                name: user.name,
                avatar: user.profilePhoto,
              },
              timestamp: Date.now(),
            });
          }
        }

        // Não precisa verificar outras reações, já detectamos uma nova
        break;
      }
    }

    // 5. Atualiza o post no banco e retorna
    return this.timelinePostModel
      .findByIdAndUpdate(new Types.ObjectId(id), updatePostDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<TimelinePost | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId format');
    }
    return this.timelinePostModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
  }
}
