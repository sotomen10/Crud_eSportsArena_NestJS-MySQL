import { PartialType } from '@nestjs/swagger';
import { CreateTournametDto } from './create-tournamet.dto';

export class UpdateTournametDto extends PartialType(CreateTournametDto) {}
