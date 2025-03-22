import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Poll, PollDocument } from './schemas/poll.schema';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';

@Injectable()
export class PollsService {
  constructor(@InjectModel(Poll.name) private pollModel: Model<PollDocument>) {}

  async create(createPollDto: CreatePollDto): Promise<PollDocument> {
    const createdPoll = new this.pollModel(createPollDto);
    return createdPoll.save();
  }

  async findAll(): Promise<PollDocument[]> {
    return this.pollModel.find().exec();
  }

  async findOne(id: string): Promise<PollDocument> {
    const poll = await this.pollModel.findById(id).exec();
    if (!poll) {
      throw new NotFoundException(`Poll with id ${id} not found`);
    }
    return poll;
  }

  async update(
    id: string,
    updatePollDto: UpdatePollDto,
  ): Promise<PollDocument> {
    const updatedPoll = await this.pollModel
      .findByIdAndUpdate(id, updatePollDto, { new: true })
      .exec();
    if (!updatedPoll) {
      throw new NotFoundException(`Poll with id ${id} not found`);
    }
    return updatedPoll;
  }

  async remove(id: string): Promise<PollDocument | null> {
    const deletedPoll = await this.pollModel.findById(id).exec();
    if (!deletedPoll) {
      throw new NotFoundException(`Poll with id ${id} not found`);
    }
    return this.pollModel.findByIdAndDelete(id).exec();
  }
}
