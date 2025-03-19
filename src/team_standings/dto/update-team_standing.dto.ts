import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamStandingDto } from './create-team_standing.dto';

export class UpdateTeamStandingDto extends PartialType(CreateTeamStandingDto) {}
