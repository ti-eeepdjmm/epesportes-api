import { PartialType } from '@nestjs/mapped-types';
import { CreateLineupDto } from './create-lineup.dto';

export class UpdateLineupDto extends PartialType(CreateLineupDto) {}
