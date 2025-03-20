import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimelinePost } from './schemas/timeline_posts.schema';
import { CreateTimelinePostDto } from './dto/create-timeline_post.dto';
import { UpdateTimelinePostDto } from './dto/update-timeline_post.dto';

@Injectable()
export class TimelinePostsService {
  constructor(
    @InjectModel(TimelinePost.name)
    private timelinePostModel: Model<TimelinePost>,
  ) {}

  async create(createPostDto: CreateTimelinePostDto): Promise<TimelinePost> {
    const newPost = new this.timelinePostModel(createPostDto);
    return newPost.save();
  }

  async findAll(): Promise<TimelinePost[]> {
    return this.timelinePostModel.find().exec();
  }

  async findOne(id: string): Promise<TimelinePost | null> {
    return this.timelinePostModel.findById(id).exec();
  }

  async update(
    id: string,
    updatePostDto: UpdateTimelinePostDto,
  ): Promise<TimelinePost | null> {
    return this.timelinePostModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<TimelinePost | null> {
    return this.timelinePostModel.findByIdAndDelete(id).exec();
  }
}
