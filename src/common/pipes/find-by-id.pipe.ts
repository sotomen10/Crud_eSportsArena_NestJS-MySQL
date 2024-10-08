import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { FindById } from '../dto/find-by-id.dto'; 
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class FindByIdPipeCustom implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        
        if (metatype !== FindById) {
            return value; 
        }

       
        if (typeof value !== 'string') {
            throw new BadRequestException('ID must be a string');
        }

      
        const object = plainToInstance(FindById, { id: value });

     
        const errors = await validate(object);
        if (errors.length > 0) {
            const errorMessages = errors.map(error =>
                Object.values(error.constraints).join(', ')
            ).join('; ');
            throw new BadRequestException(`Validation failed: ${errorMessages}`);
        }

        return object; 
    }
}
