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

    const hasValidProperties = Object.keys(value).some(
      key => value[key] !== undefined && value[key] !== ''
    );

    if (!hasValidProperties) {
      throw new BadRequestException('At least one valid property is required.');
    }

    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed: check your data.');
    }

    const allowedKeys = Object.keys(new UpdatePlayerDto());
    const invalidKeys = Object.keys(value).filter(key => !allowedKeys.includes(key));

    const validProperties = Object.keys(object);
    if (invalidKeys.length > 0 && !validProperties.includes(invalidKeys[0])) {
      throw new BadRequestException(`Invalid fields: ${invalidKeys.join(', ')}`);
    }

    return object;
  }
}
