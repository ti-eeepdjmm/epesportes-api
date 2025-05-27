import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Poll, PollDocument } from './schemas/poll.schema';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { AppGateway } from '../app-gateway/app/app.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';
import { NotificationType } from '../notifications/schemas/notification.entity';
import {
  GlobalNotificationPayload,
  PollUpdatePayload,
} from '../common/types/socket-events.types';

@Injectable()
export class PollsService {
  constructor(
    @InjectModel(Poll.name) private pollModel: Model<PollDocument>,
    private readonly appGateway: AppGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createPollDto: CreatePollDto): Promise<PollDocument> {
    const newPoll = new this.pollModel(createPollDto);
    const createdPoll = await newPoll.save();
    // create and save the notification
    const newNotification: CreateNotificationDto = {
      type: NotificationType.POLL,
      message: `Nova enquete criada`,
      date: new Date(),
      link: `polls/${createdPoll.id}`,
      isGlobal: true,
    };
    await this.notificationsService.create(newNotification);
    // Emit the notifications to frontend
    const payload: GlobalNotificationPayload = {
      message: 'Nova Enquete Criada',
      title: createdPoll.question,
      link: `polls/${createdPoll.id}`,
      timestamp: Date.now(),
      type: 'poll',
    };
    this.appGateway.emitGlobalNotification(payload);
    // return the created poll
    return createdPoll;
  }

  async findAll(): Promise<PollDocument[]> {
    return this.pollModel.find().sort({ expiration: -1 }).exec();
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
    // test if poll has expired!
    if (updatedPoll.expiration.getTime() < Date.now()) {
      const newNotification: CreateNotificationDto = {
        type: NotificationType.POLL,
        message: `Enquete Finalizada!`,
        date: new Date(),
        link: `polls/${updatedPoll.id}`,
        isGlobal: true,
      };
      await this.notificationsService.create(newNotification);

      const payload: GlobalNotificationPayload = {
        message: 'Enquete Finalizada!',
        title: updatedPoll.question,
        link: `polls/${updatedPoll.id}`,
        timestamp: Date.now(),
        type: 'poll',
      };
      this.appGateway.emitGlobalNotification(payload);
    } else {
      const mappedOptions = updatedPoll.options.map((option, index) => ({
        id: index, // ou se já houver um id, use option.id
        option: option.option, // ou apenas option se o item for uma string
        votes: option.votes,
      }));
      const payload: PollUpdatePayload = {
        pollId: updatedPoll.id as string,
        title: updatedPoll.question,
        options: mappedOptions,
        totalVotes: updatedPoll.totalVotes,
        expiration: updatedPoll.expiration,
        date: new Date(),
      };
      this.appGateway.emitPollUpdate(payload);
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

  async voteOnPoll(
    pollId: string,
    userId: number,
    optionText: string,
  ): Promise<PollDocument> {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) {
      throw new NotFoundException(`Enquete com id ${pollId} não encontrada.`);
    }

    if (poll.expiration.getTime() < Date.now()) {
      throw new BadRequestException('A enquete está encerrada.');
    }

    const alreadyVoted = poll.options.some((opt) =>
      opt.userVotes.includes(userId),
    );
    if (alreadyVoted) {
      throw new BadRequestException('Usuário já votou nesta enquete.');
    }

    const option = poll.options.find((opt) => opt.option === optionText);
    if (!option) {
      throw new NotFoundException('Opção não encontrada na enquete.');
    }

    option.userVotes.push(userId);
    await poll.save();

    // Emitir atualização
    const mappedOptions = poll.options.map((opt, index) => ({
      id: index,
      option: opt.option,
      votes: opt.userVotes.length,
    }));

    const payload: PollUpdatePayload = {
      pollId: poll.id as string,
      title: poll.question,
      options: mappedOptions,
      totalVotes: poll.totalVotes,
      expiration: poll.expiration,
      date: new Date(),
    };

    this.appGateway.emitPollUpdate(payload);

    return poll;
  }
}
