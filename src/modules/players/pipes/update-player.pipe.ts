import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdatePlayerDto } from '../dto/update-player.dto'; 

@Injectable()
export class UpdatePlayerPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    
    if (metatype !== UpdatePlayerDto) {
      return value;
    }

    const object = plainToInstance(UpdatePlayerDto, value);

    const hasValidProps = Object.keys(value).some(
      key => value[key] !== undefined && value[key] !== ''
    );

    if (!hasValidProps) {
      throw new BadRequestException('At least one valid property is required for update.');
    }

    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed: check your data.');
    }

    const allowedKeys = Object.keys(new UpdatePlayerDto());
    const invalidKeys = Object.keys(value).filter(key => !allowedKeys.includes(key));

    const validProps = Object.keys(object);
    if (invalidKeys.length > 0 && !validProps.includes(invalidKeys[0])) {
      throw new BadRequestException(`Invalid properties: ${invalidKeys.join(', ')}`);
    }

    return object;
  }
}
