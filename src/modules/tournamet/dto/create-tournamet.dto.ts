
import { IsNotEmpty, IsString, IsDate, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateTournametDto {
    @IsNotEmpty()
    @IsString()
    name: string; 

    @IsOptional()
    @IsString()
    description?: string; 

    @IsNotEmpty()
    @IsDate()
    startDate: Date; 

    @IsNotEmpty()
    @IsDate()
    endDate: Date; 

    @IsOptional()
    @IsNumber()
    prizePool?: number; 

    @IsOptional()
    @IsBoolean()
    isActive?: boolean; 
}
