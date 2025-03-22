import { PartialType } from '@nestjs/mapped-types';
import { CreateMentionDto } from './create-mention.dto';

export class UpdateMentionDto extends PartialType(CreateMentionDto) {}
