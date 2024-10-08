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
        // Comprobar si el metatype es FindById
        if (metatype !== FindById) {
            return value; // Retorna el valor original si no es el tipo esperado
        }

        // Asegúrate de que value es un string que contiene el id
        if (typeof value !== 'string') {
            throw new BadRequestException('ID must be a string');
        }

        // Convertir el valor a una instancia del DTO FindById
        const object = plainToInstance(FindById, { id: value });

        // Validar el objeto
        const errors = await validate(object);
        if (errors.length > 0) {
            const errorMessages = errors.map(error =>
                Object.values(error.constraints).join(', ')
            ).join('; ');
            throw new BadRequestException(`Validation failed: ${errorMessages}`);
        }

        return object; // Devuelve el objeto validado
    }
}
