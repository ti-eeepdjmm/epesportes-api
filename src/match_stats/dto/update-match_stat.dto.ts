import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchStatDto } from './create-match_stat.dto';

export class UpdateMatchStatDto extends PartialType(CreateMatchStatDto) {}
