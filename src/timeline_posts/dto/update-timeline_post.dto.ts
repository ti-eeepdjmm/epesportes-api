import { PartialType } from '@nestjs/mapped-types';
import { CreateTimelinePostDto } from './create-timeline_post.dto';

export class UpdateTimelinePostDto extends PartialType(CreateTimelinePostDto) {}
