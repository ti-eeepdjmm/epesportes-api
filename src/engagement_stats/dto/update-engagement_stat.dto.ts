import { PartialType } from '@nestjs/mapped-types';
import { CreateEngagementStatDto } from './create-engagement_stat.dto';

export class UpdateEngagementStatDto extends PartialType(CreateEngagementStatDto) {}
