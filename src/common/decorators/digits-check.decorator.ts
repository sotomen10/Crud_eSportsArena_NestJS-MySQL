import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'checkNumberLength', async: false })
export class CheckNumberLengthConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
   
    if (typeof value !== 'number') return false;

    return value.toString().length === args.constraints[0];
  }

  defaultMessage(args: any) {
    return `El número debe tener exactamente ${args.constraints[0]} dígitos.`;
  }
}

export function CheckNumberLength(length: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'checkNumberLength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [length],
      validator: CheckNumberLengthConstraint,
    });
  };
}

