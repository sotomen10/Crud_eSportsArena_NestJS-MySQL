import { IsString, IsEmail, IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty, IsUUID } from "class-validator";
import { IsNumericDigits } from "src/common/decorators/numerical-quantity";

export class CreatePlayerDto {

    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    confirmPassword: string;

    @IsNotEmpty()
    @IsNumber()
    @IsNumericDigits(11, { message: 'Phone number should be 10 digits only' })
    phone: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true }) 
    roles: number[];
}

