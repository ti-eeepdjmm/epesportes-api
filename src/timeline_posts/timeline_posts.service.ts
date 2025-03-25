import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TimelinePost } from './schemas/timeline_post.schema';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { UpdateTimelinePostDto } from './dto/update-timeline_post.dto';
import { AppGateway } from '../app-gateway/app/app.gateway';
import { NewPostPayload } from 'src/common/types/socket-events.types';

@Injectable()
export class TimelinePostsService {
  constructor(
    @InjectModel(TimelinePost.name)
    private timelinePostModel: Model<TimelinePost>,
    private readonly appGateway: AppGateway,
  ) {}

  async create(createPostDto: CreateTimelinePostDto): Promise<TimelinePost> {
    const newPost = new this.timelinePostModel(createPostDto);
    // enviar notificacao
    const payload: NewPostPayload = {
      postId: newPost._id as string,
      author: newPost.userId,
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
