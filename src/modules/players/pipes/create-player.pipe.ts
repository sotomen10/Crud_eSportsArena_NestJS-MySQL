import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePlayerDto } from '../dto/create-player.dto';

@Injectable()
export class CreatePlayerPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
 
    if (metatype !== CreatePlayerDto) {
      return value;
    }

    
    const object = plainToInstance(CreatePlayerDto, value);
    const errors = await validate(object);

    
    if (errors.length > 0) {
      const errorMessages = errors.map(error =>
        Object.values(error.constraints).join(', ')
      ).join('; ');

      throw new BadRequestException(`Validation failed: ${errorMessages}`);
    }

    return object; 
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
