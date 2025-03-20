import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimelinePost } from './schemas/timeline_posts.schema';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';

@Injectable()
export class TimelinePostsService {
  constructor(
    @InjectModel(TimelinePost.name)
    private timelinePostModel: Model<TimelinePost>,
  ) {}

  async create(
    createTimelinePostDto: CreateTimelinePostDto,
  ): Promise<TimelinePost> {
    const createdPost = new this.timelinePostModel(createTimelinePostDto);
    return createdPost.save();
  }

  async findAll(): Promise<TimelinePost[]> {
    return this.timelinePostModel.find().exec();
  }

  async findOne(id: string): Promise<TimelinePost | null> {
    return this.timelinePostModel.findById(id).exec();
  }

  async remove(id: string): Promise<TimelinePost | null> {
    return this.timelinePostModel.findByIdAndDelete(id).exec();
  }
}
