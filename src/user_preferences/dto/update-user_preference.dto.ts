import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPreferenceDto } from './create-user_preference.dto';

export class UpdateUserPreferenceDto extends PartialType(CreateUserPreferenceDto) {}
