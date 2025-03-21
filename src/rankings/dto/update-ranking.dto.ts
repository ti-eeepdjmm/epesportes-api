import { PartialType } from '@nestjs/mapped-types';
import { CreateRankingDto } from './create-ranking.dto';

export class UpdateRankingDto extends PartialType(CreateRankingDto) {}
